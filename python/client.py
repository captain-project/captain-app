import socketio
import captain_api
import asyncio

sio = socketio.AsyncClient(logger=False, engineio_logger=False)


async def emit(service, data):
    return await sio.emit("create", (service, data))


@sio.event
async def connect():
    print("Python connected!")


@sio.event
def connect_error(data):
    print("Python connection failed!", data, flush=True)


@sio.event
def disconnect():
    print("Python disconnected!", flush=True)


@sio.on("messages created")
async def on_message(data):
    # print("python got message:", data, flush=True)

    if "type" not in data:
        await emit("progress", {"type": "error", "status": "error", "message": f"Missing 'type' in data"})
        return

    msg_type = data["type"]
    print(f"Got message with type '{msg_type}':", data, flush=True)

    if msg_type == "test":
        # print(f"Python testing...", flush=True)
        for i in range(3):
            await emit("progress", {"type": "test", "status": "progress", "data": f"Waiting {i+1} of 3 seconds..."})
            await asyncio.sleep(1)
        await emit("progress", {"type": "test", "status": "finished"})
        return

    if msg_type == "simulation":
        await emit("progress", {"type": "simulation", "status": "start", "data": data["data"]})

        sim_file = captain_api.init_simulated_system(**data["data"]["init"])
        # print(flush=True)

        progress_items = []
        # job_id = data["data"]["id"]
        # TODO: Use dates as job ids and save output to folder with job id name

        async def progress_task():
            finished = False
            while True:
                await asyncio.sleep(0.001)
                while len(progress_items) > 0:
                    progress_item = progress_items.pop(0)
                    # print(f"Progress task have {len(progress_items) + 1} items, processing {progress_data}")
                    await emit("progress", progress_item)
                    if progress_item["status"] == "finished":
                        finished = True
                if finished:
                    break

        async def captain_task():
            for progress_item in captain_api.simulate_biodiv_env(sim_file=sim_file, **data["data"]["run"]):
                # print(progress_type, progress_data, flush=True)
                progress_items.append(progress_item)
                await asyncio.sleep(0.001)

        await asyncio.gather(
            progress_task(),
            captain_task(),
        )

        print("captain task finished!", flush=True)
        # TODO: Already emits a status finished event from above?
        # await emit("progress", { "type": "simulation", "status": "finished" })
        return

    if msg_type == "policy":
        await emit("progress", {"type": "policy", "status": "start"})
        data_for_random_policy = {**data["data"]}
        data_for_random_policy["trainedModel"] = None
        data_for_random_policy["obsMode"] = 0
        data_for_random_policy["outFile"] = data_for_random_policy["outFileRandom"]

        progress_items = []
        # job_id = data["data"]["id"]
        # TODO: Use dates as job ids and save output to folder with job id name

        async def progress_task():
            num_finished = 0
            while True:
                await asyncio.sleep(0.001)
                while len(progress_items) > 0:
                    item = progress_items.pop(0)
                    # print(f"Progress task have {len(progress_items) + 1} items, processing {item}")
                    if item["status"] == "finished":
                        num_finished += 1
                    else:
                        await emit("progress", item)
                if num_finished == 2:
                    break

        async def run_random_policy():
            for progress_item in captain_api.run_policy(**data_for_random_policy):
                progress_item["type"] = "random-policy"
                progress_items.append(progress_item)
                await asyncio.sleep(0.001)

        async def run_policy():
            for progress_item in captain_api.run_policy(**data["data"]):
                progress_items.append(progress_item)
                await asyncio.sleep(0.001)

        await asyncio.gather(
            progress_task(),
            run_random_policy(),
            run_policy(),
        )

        await emit("progress", {"type": "policy", "status": "finished"})
        return

    await emit("progress", {"type": "error", "status": "error", "message": f"Type '{msg_type}' not recognized"})
    print(flush=True)


async def main():
    await sio.connect("http://localhost:3030")
    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())

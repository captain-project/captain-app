import socketio
import captain_api
import asyncio

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

async def emit(service, data_type, data=None):
    return await sio.emit("create", (service, { "type": data_type, "data": data }))


@sio.event
async def connect():
    print("Python connected!")
    await emit("progress", "connected", "Python connected")

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
        # await sio.emit('pythonerror', { 'type': 'error', 'message': "No 'type' in data" })
        await emit("progress", "error", "No 'type' in data")
        return

    msg_type = data["type"]
    print(f"Got message with type '{msg_type}':", data, flush=True)

    if msg_type == "test:python":
        # print(f"Python testing...", flush=True)
        for i in range(3):
            await emit("progress", "test:progress", f"Waiting {i+1} of 3 seconds...")
            await asyncio.sleep(3)
        await emit("progress", "test:progress", f"Finished!")
        return

    if msg_type == "sim:run":
        await emit("progress", "sim:run", data["data"])

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
                    progress_type, progress_data = progress_items.pop(0)
                    # print(f"Progress task have {len(progress_items) + 1} items, processing {progress_data}")
                    await emit("progress", progress_type, progress_data)
                    if progress_type == "finished_step":
                        finished = True
                if finished:
                    break

        async def captain_task():
            for progress_type, progress_data in captain_api.simulate_biodiv_env(sim_file=sim_file, **data["data"]["run"]):
                # print(progress_type, progress_data, flush=True)
                progress_items.append((progress_type, progress_data))
                await asyncio.sleep(0.001)

        await asyncio.gather(
            progress_task(),
            captain_task(),
        )

        print("captain task finished!", flush=True)
        await emit("progress", "finished")
        return

    await emit("progress", "error", f"Type '{msg_type}' not recognized")
    print(flush=True)


async def main():
    await sio.connect("http://localhost:3030")
    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())

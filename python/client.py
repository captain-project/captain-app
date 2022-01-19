import socketio
import captain_api
import asyncio

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

@sio.event
def connect():
    print("Python connected!")

@sio.event
def connect_error(data):
    print("Python connection failed!", data)

@sio.event
def disconnect():
    print("Python disconnected!")


@sio.on("messages created")
async def on_message(data):
    print("python got message:", data, flush=True)

    if "type" not in data:
        await sio.emit('pythonerror', { 'type': 'error', 'message': "No 'type' in data" })
        return

    msg_type = data["type"]
    print(f"Got message with type '{msg_type}':", data, flush=True)


    if msg_type == "sim:run":
        sim_file = captain_api.init_simulated_system(**data["data"]["init"])
        print(flush=True)


        progress_items = []
        # job_id = data["data"]["id"]
        # TODO: Use dates as job ids and save output to folder with job id name

        async def progress_task():
            finished = False
            while True:
                await asyncio.sleep(0.001)
                while len(progress_items) > 0:
                    progress_type, progress_data = progress_items.pop(0)
                    print(f"Progress task have {len(progress_items) + 1} items, processing {progress_data}")
                    await sio.emit("pythonprogress", {"type": progress_type, "data": progress_data})
                    if progress_type == "finished":
                        finished = True
                if finished:
                    break
            print("progress task finished!")

        async def captain_task():
            for progress_type, progress_data in captain_api.simulate_biodiv_env(sim_file=sim_file, **data["data"]["run"]):
                print(progress_type, progress_data, flush=True)
                progress_items.append((progress_type, progress_data))
                await asyncio.sleep(0.001)
            print("captain task finished!")

        await asyncio.gather(
            progress_task(),
            captain_task(),
        )

        print("captain task finished!", flush=True)
        return

    await sio.emit('pythonerror', { 'type': 'error', 'message': f"Type '{msg_type}' not recognized" })
    print(flush=True)


    # sio.emit("create pythonprogress")


async def main():
    await sio.connect("http://localhost:3030")
    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())

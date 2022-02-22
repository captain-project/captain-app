import captain as cn
from functools import lru_cache
import numpy as np

# int64 not json serializable
def int64_to_int(value):
    return int(value) if isinstance(value, np.integer) else value

@lru_cache
def init_simulated_system(*args, **kwargs):
    sim_file = cn.init_simulated_system(out_dir='./static/sim_data', **kwargs)
    return sim_file

def simulate_biodiv_env(*args, num_steps=1, **kwargs):

    env = cn.simulate_biodiv_env(*args, climate_mode=3, disturbance_mode=8, **kwargs)

    yield from cn.plot_env_state_generator(env, wd='./static')
    if num_steps > 1:
        for _ in range(num_steps - 1):
            env.step()
            yield from cn.plot_env_state_generator(env, wd='./static')

    yield { "type": "simulation", "status": "finished", "data": { "num_steps": num_steps }}

def run_policy(*args, **kwargs):
    print(f"Run policy...", flush=True)
    for progress in cn.run_policy_generator(rnd_seed=kwargs["rnd_seed"],
            budget=kwargs["budget"],
            time_steps=kwargs["time_steps"],
            n_nodes=kwargs["n_nodes"],
            sim_file=kwargs["sim_file"],
            trained_model=kwargs["trainedModel"],
            obsMode=kwargs["obsMode"], # full species monitoring
            observePolicy=kwargs["observePolicy"], # recurrent monitoring, dynamic protection
            rewardMode=kwargs["rewardMode"], # objective: minimize species loss
            # wd=kwargs["simDataDir"],  # directory with pre-simulated systems
            wd=None,
            plot_dir="./static",
            outfile=kwargs["outFile"],
            plot_sim=True,
    ):
         # int64 not json serializable
        if progress["type"] == "simulation" and progress["status"] == "finished":
            data = { key: int64_to_int(value) for key, value in progress["data"].items() }
            progress["data"] = data
        yield progress

    print(f"Finished run policy!", flush=True)

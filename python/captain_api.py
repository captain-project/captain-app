import captain as cn
from functools import lru_cache
import numpy as np
from pathlib import Path

DIR_NAME = "./static/data"

Path(DIR_NAME).mkdir(exist_ok=True)


# int64 not json serializable
def int64_to_int(value):
    return int(value) if isinstance(value, np.integer) else value

def get_folder_name(n_species, grid_size, cell_capacity, **_):
    return f"sp{n_species}_gs{grid_size}_cc{cell_capacity}"

def get_folder_path(n_species, grid_size, cell_capacity, **_):
    return Path(DIR_NAME) / get_folder_name(n_species, grid_size, cell_capacity)

def get_initiated_systems():
    return [p.name for p in Path(DIR_NAME).glob("sp*_gs*_cc*")]

def get_sim_file(n_species, grid_size, cell_capacity):
    p = get_folder_path(n_species, grid_size, cell_capacity) / "pickles"
    # Example sim_file: {out_dir}/pickles/init_cell_4582_c20_s5_d0.3_t0.25.pkl
    sim_file = list(p.glob("init_cell_*"))[0]
    return sim_file

@lru_cache
def init_simulated_system(n_species, grid_size, cell_capacity):
    folder_path = get_folder_path(n_species, grid_size, cell_capacity)
    sim_file = cn.init_simulated_system(out_dir=folder_path, n_species=n_species, grid_size=grid_size, cell_capacity=cell_capacity)
    # Example sim_file: {out_dir}/pickles/init_cell_4582_c20_s5_d0.3_t0.25.pkl
    # cell_file_pkl from captain-dev/biodivinit/SimulatorInit.py: "init_cell_{rseed}_c{grid_size}_s{n_species}_d{dispersal_rate}_t{death_at_climate_boundary}"
    return sim_file

# def simulate_biodiv_env(*args, num_steps=1, **kwargs):

#     env = cn.simulate_biodiv_env(*args, climate_mode=3, disturbance_mode=8, **kwargs)

#     yield from cn.plot_env_state_generator(env, wd='./static')
#     if num_steps > 1:
#         for _ in range(num_steps - 1):
#             env.step()
#             yield from cn.plot_env_state_generator(env, wd='./static')

#     yield { "type": "simulation", "status": "finished", "data": { "num_steps": num_steps }}

def run_policy(sim_file, run, init):
    output_folder = get_folder_path(init["n_species"], init["grid_size"], init["cell_capacity"])
    print(f"Run policy, output to '{output_folder}'...", flush=True)
    for progress in cn.run_policy_generator(rnd_seed=run["rnd_seed"],
            budget=run["budget"],
            time_steps=run["time_steps"],
            n_nodes=run["n_nodes"],
            sim_file=sim_file,
            trained_model=run["trainedModel"],
            obsMode=run["obsMode"], # full species monitoring
            observePolicy=run["observePolicy"], # recurrent monitoring, dynamic protection
            rewardMode=run["rewardMode"], # objective: minimize species loss
            # wd=run["simDataDir"],  # directory with pre-simulated systems
            resolution=np.array([run["resolution"], run["resolution"]]), # resolution=np.array([5, 5]), # need to be divisors of grid size
            wd=None,
            plot_dir=output_folder,
            outfile=run["outFile"],
            plot_sim=True,
    ):
         # int64 not json serializable
        if progress["type"] == "simulation" and progress["status"] == "finished":
            data = { key: int64_to_int(value) for key, value in progress["data"].items() }
            progress["data"] = data
        yield progress

    print(f"Finished run policy!", flush=True)


import captain_api
import captain as cn

def run_simulation(yield_progress=False):
    print("Init simulation...")
    sim_file = cn.init_simulated_system(n_species=25,
                                    grid_size=20,
                                    cell_capacity=25,
                                    out_dir='./tmp/sim_data')
    print("Run simulation...")
    env = cn.simulate_biodiv_env(sim_file,
                                dispersal_rate=0.3,
                                climate_mode=3,
                                disturbance_mode=8)
    print("Plot simulation...")
    cn.plot_env_state(env, wd='./tmp', file_format="one_pdf")
    return

def run_something(progress_callback=None):
    sum = 0
    for i in range(10):
        sum += i
        if callable(progress_callback):
            progress_callback(sum)
    return sum


def test_conditional_yield(yield_progress=False):
    if not yield_progress:
        return run_something()
    def progress_callback(value):
        yield value
    run_something(progress_callback=progress_callback)

def run_something_with_progress():
    def progress_callback(value):
        yield value
    run_something(progress_callback=progress_callback)

def run_policy():
    data = {
        "rnd_seed": 123,
        "simulations": 1,
        "budget": 0.11,
        "steps": 20,
        "n_nodes": [4, 0],
        "obsMode": 5,
        "rewardMode": 2,
        "observePolicy": 1,
        # "trainedModel": None,
        "trainedModel": "./trained_models/area_d4_n4-0.log",
        "simDataDir": "./static/sim_data/pickles",
        "outFile": "./static/policy.log",
    }
    print(f"Run policy...")
    captain_api.run_policy(**data)

if __name__ == "__main__":
    run_policy()
    # run_simulation()
    # result = test_conditional_yield()
    # print(f"Result: {type(result)} {result}")
    # print("With yield...")
    # for value in run_something_with_progress():
    #     print(value)

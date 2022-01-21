import captain as cn
from functools import lru_cache


@lru_cache
def init_simulated_system(*args, **kwargs):
    sim_file = cn.init_simulated_system(out_dir='./static/sim_data', **kwargs)
    return sim_file


def simulate_biodiv_env(*args, num_steps=1, **kwargs):
    """
    yields plot:progress and plot:finished
    """
    env = cn.simulate_biodiv_env(*args, climate_mode=3, disturbance_mode=8, **kwargs)

    yield from cn.plot_env_state(env, wd='./static', file_format="svg", yield_progress=True)
    if num_steps > 1:
        for _ in range(num_steps - 1):
            env.step()
            yield from cn.plot_env_state(env, wd='./static', file_format="svg", yield_progress=True)

    yield "finished_step", num_steps


def run_policy():
    cn.run_policy(simulations=1,
                  steps=1,
                  trained_model=None,
                  budget=0.11,
                  observePolicy=1,
                  wd="./static/sim_data/pickles",
                  outfile="sim_random_policy.log",
                  )

    return "sim_random_policy.log"

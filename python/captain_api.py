import captain as cn


def init_simulated_system(*args, **kwargs):
    sim_file = cn.init_simulated_system(out_dir='./static/sim_data', **kwargs)
    return sim_file


def simulate_biodiv_env(*args, num_steps=1, **kwargs):
    env = cn.simulate_biodiv_env(*args, climate_mode=3, disturbance_mode=8, **kwargs)

    yield from cn.plot_env_state(env, wd='./static', file_format="svg", yield_progress=True)
    if num_steps > 1:
        for _ in range(num_steps - 1):
            env.step()
            yield from cn.plot_env_state(env, wd='./static', file_format="svg", yield_progress=True)

    yield "finished", num_steps



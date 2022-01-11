import captain as cn


def init_simulated_system(*args, **kwargs):
    sim_file = cn.init_simulated_system(out_dir='./static/sim_data', **kwargs)
    return sim_file


def simulate_biodiv_env(*args, progress_callback=None, num_steps=1, **kwargs):
    env = cn.simulate_biodiv_env(*args, num_steps=num_steps, climate_mode=3, disturbance_mode=8, **kwargs)

    cn.plot_env_state(env, wd='./static', file_format="svg", progress_callback=progress_callback)
    if num_steps > 0:
        for _ in range(num_steps):
            env.step()
            cn.plot_env_state(env, wd='./static', file_format="svg")



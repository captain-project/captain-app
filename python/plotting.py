import numpy as np
import matplotlib.pyplot as plt

def render_test_plot():
    print("Render scatter plot...")
    data = {'a': np.arange(50),
            'c': np.random.randint(0, 50, 50),
            'd': np.random.randn(50)}
    data['b'] = data['a'] + 10 * np.random.randn(50)
    data['d'] = np.abs(data['d']) * 100

    plt.scatter('a', 'b', c='c', s='d', data=data)
    plt.xlabel('entry a')
    plt.ylabel('entry b')

    # plt.show()
    plt.savefig("static/plot.svg")
    print("Done saving plot to plot.svg", flush=True)

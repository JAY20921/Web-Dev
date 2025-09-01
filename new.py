import matplotlib.pyplot as plt
import matplotlib.animation as animation
import random

def update_bars(bars, n, rects):
    for i in range(n - 1):
        if bars[i] > bars[i + 1]:
            rects[i].set_color('green')
            rects[i + 1].set_color('green')
            bars[i], bars[i + 1] = bars[i + 1], bars[i]
            rects[i].set_height(bars[i])
            rects[i + 1].set_height(bars[i + 1])
        else:
            rects[i].set_color('grey')
            rects[i + 1].set_color('grey')
    return rects

def init():
    return rects

def animate(i):
    global bars, rects
    rects = update_bars(bars, len(bars), rects)
    if sorted(bars) == bars:
        a.event_source.stop()
    return rects

if __name__ == '__main__':
    n = 20
    fig, ax = plt.subplots()
    bars = [random.randint(0, 50) for _ in range(n)]
    x = range(n)
    rects = ax.bar(x, bars, color='grey')
    ax.set_title('Bar Chart Animation')
    a = animation.FuncAnimation(fig, animate, init_func=init, interval=1000, repeat=False)
    plt.show()
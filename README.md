# SimpleTile

A simple tiling extension for Gnome Shell that (omg) works on the most
recent version (currently 3.22.2).  SimpleTile does not do any automatic
tiling -- instead it allows you to move the focused window to a particular
grid position.

Still a work in progress.

## Installation

Clone to the shell extensions folder:

```
cd ~/.local/share/gnome-shell/extensions/
git clone https://github.com/ledbettj/simple-tile.git SimpleTile@throttle.io
```

Activate in `gnome-tweak-tool`.

Use `Super+KeyPad<N>` to move the focused window.  For example,
`Super+KeyPad3` will move the focused window to the bottom right quadrant.


## Status

This is a really simple, early version.  Currently it supports tiling to
the top,bottom, left or right halves of the screen, as well as any quarter
of the screen.

Current limitations:

* preference pane is not yet built.  this means keybindings are not easily configurable.
* does not take panel/bar into account when calculating grid position/height.
* does not support more than 1 monitor.


These are all planned.

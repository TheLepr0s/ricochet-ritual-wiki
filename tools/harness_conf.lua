-- conf.lua for the wiki's LÖVE harnesses (dump_main.lua, portraits_main.lua).
--
-- The game's own conf.lua starts FULLSCREEN, which takes over the desktop for a
-- script whose entire job is to write a file and quit. This opens a small window
-- off-screen instead. Graphics still have to be on: the portrait pass renders
-- through a shader and needs a canvas.
function love.conf(t)
    t.identity = "RicochetRitualWiki"
    t.version  = "11.5"
    t.console  = false

    t.window.title      = "wiki tooling"
    t.window.width      = 320
    t.window.height     = 200
    t.window.fullscreen = false
    t.window.resizable  = false
    t.window.vsync      = 0
    t.window.x          = -3200
    t.window.y          = -3200

    t.modules.joystick = false
    t.modules.physics  = false
    t.modules.thread   = false
    t.modules.touch    = false
    t.modules.video    = false
end

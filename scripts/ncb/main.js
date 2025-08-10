import * as s  from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import * as gt from '@minecraft/server-gametest';
import * as cmn from '@minecraft/common';
import * as dbg from '@minecraft/debug-utilities';

/*
    ncb template v0.1.2.rev0
    template for making mods using ncb (new codebase)
*/

let ncb = {
    ver: 'ncb0.1.2.rev0',
    methods: {
        check_op: function(player) { // wrap the operator check, to make things easier
            if (player.commandPermissionLevel >= 2) return true;
            return false
        }
    },
    debug: {
        run_thru: function(v) {
            return eval(v);
        }
    },
    listeners: {
        before_events: {
            chatSend: function(e) {
                // 100 max characters
                if (e.message.length > 100) {
                    e.sender.sendMessage(`\xa7cYou can\'t send a message that long\xa7f! \xa7f(\xa7c${e.message.length} \xa7f>\xa7c 100\xa7f)`)
                    return;
                } 
                // makes it so you can't use §k in chat
                if (e.message.includes('\xa7k')) {
                    e.sender.sendMessage(`\xa7cYou can\'t use that formatting code in chat\xa7f!`)
                    return;
                }
                s.world.sendMessage(`${e.sender.name} \xa7i»\xa7r ${e.message}`) // send the message globally
            }
        },
        after_events: {
            playerSpawn: function(e) {
                // runs when a player spawns
                if (e.initialSpawn) {
                    let player = e.player;
                        player.sendMessage(`\xa7ewelcome to the ncb template\xa7f! \xa7i- \xa7f(\xa7e${ncb.ver}\xa7f)`);
                }
            }
        }
    },
    listeners_system: {
        before_events: {
            
        },
        after_events: {
            
        }
    },
    on_tick: function() {
        s.system.runInterval(() => {
            // runs every game tick
        })
    },
    on_load: function() {
        // runs when the script is loaded
        s.world.sendMessage(`\xa7fScript reloaded\xa7i! (NCB Template)`);
    }
}
s.world.afterEvents.worldLoad.subscribe(() => {
    for (let key of Object.keys(ncb.listeners.before_events)) {
        s.world.beforeEvents[key].subscribe(ncb.listeners.before_events[key]);
    }
    for (let key of Object.keys(ncb.listeners.after_events)) {
        s.world.afterEvents[key].subscribe(ncb.listeners.after_events[key]);
    }
    for (let key of Object.keys(ncb.listeners_system.before_events)) {
        s.system.beforeEvents[key].subscribe(ncb.listeners_system.before_events[key]);
    }
    for (let key of Object.keys(ncb.listeners_system.after_events)) {
        s.system.afterEvents[key].subscribe(ncb.listeners_system.after_events[key]);
    }
    ncb.dimensions = {
        overworld: s.world.getDimension('minecraft:overworld'),
        nether: s.world.getDimension('minecraft:nether'),
        the_end: s.world.getDimension('minecraft:the_end')
    }
    ncb.on_load();
    ncb.on_tick();
})
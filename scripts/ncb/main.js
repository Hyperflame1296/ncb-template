import * as s  from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import * as gt from '@minecraft/server-gametest';

/*
    ncb template v0.1.1
    template for making mods using ncb (new codebase)
*/

let ncb = {
    ver: 'ncb0.1.1',
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
    command_prefix: '!',
    listeners: {
        before_events: {
            chatSend: function(e) {
                e.cancel = true; // cancel the chat message
                if (e.message.startsWith(ncb.command_prefix)) {
                    let a = e.message.split(' '),
                        b = a[0]?.trim()?.toLowerCase(),
                        c = a[1]?.trim()?.toLowerCase();

                    let cmd = ncb.commands.find(cmd => `${ncb.command_prefix}${cmd.name}` === b) // stupid way of doing this, but it works
                    if (cmd) {
                        if (cmd.requires_op && !ncb.methods.check_op(e.sender)) { // check if the command requires op and if the player is op
                            e.sender.sendMessage(`\xa7cYou don\'t have permission to use this command\xa7f!`);
                            return;
                        }
                        cmd.func(a, e.sender) // run the command
                    } else
                        e.sender.sendMessage(`\xa7cNo such command \xa7f\'!\xa7c${b.replace(ncb.command_prefix, '')}\xa7f\'\xa7f!`); // send a message to the player that the command doesn't exist
                } else {
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

            for (let player of s.world.getPlayers()) {
                player.runCommand(`title @a times 0 60 20`);
                player.onScreenDisplay.setActionBar(`ncbtemplate - ${ncb.ver}`)
            }
        })
    },
    on_load: function() {
        // runs when the script is loaded
        s.world.sendMessage(`script reloaded!`);
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
    eiop.dimensions = {
        overworld: s.world.getDimension('minecraft:overworld'),
        nether: s.world.getDimension('minecraft:nether'),
        the_end: s.world.getDimension('minecraft:the_end')
    }
    ncb.commands = [
        {
            name: 'help',
            desc: 'Shows all of the available commands.',
            requires_op: false,
            syntax: [
                `${ncb.command_prefix}\xa7ehelp \xa7i[\xa7fcommand\xa7i]`,
            ],
            send_usage: function(player) {
                player.sendMessage('\xa7eUsage\xa7f: \n    ' + this.syntax.join('\n'));
            },
            func: function(a, player) {
                try {
                    let
                        b = a[0]?.trim()?.toLowerCase(),
                        c = a[1]?.trim()?.toLowerCase()
                    if (c) {
                        let cmd = ncb.commands.find(cmd => `${ncb.command_prefix}${cmd.name}` === c || `${cmd.name}` === c);
                        player.sendMessage(`\xa7f${ncb.command_prefix}\xa7e${cmd.name}\xa7f - \xa7i\xa7o${cmd.desc}\xa7r`);
                        cmd.send_usage(player); // send the usage of the command
                    } else {
                        let msg = '\xa7eCommands\xa7f:'
                        let msgop = '\xa7eOperator Commands\xa7f:'
                        for (let command of ncb.commands.filter(cmd => !cmd.requires_op)) {
                            msg += `\n    \xa7f!\xa7e${command.name} \xa7i- \xa7i\xa7o${command.desc}\xa7r`;
                        }
                        for (let command of ncb.commands.filter(cmd => cmd.requires_op)) {
                            msgop += `\n    \xa7f!\xa7e${command.name} \xa7i- \xa7i\xa7o${command.desc}\xa7r`;
                        }
                        player.sendMessage(`${msg}${ncb.methods.check_op(player) ? '\n' + msgop : ''}`);
                    }
                } catch (e) {
                    player.sendMessage(`\xa7cERROR \xa7f- \xa7c${e.message}`); // send an error message to the player
                }
            }
        },
        {
            name: 'clear_chat',
            desc: 'Clears the chat.',
            requires_op: true,
            syntax: [
                `${ncb.command_prefix}\xa7eclear_chat`,
            ],
            send_usage: function(player) {
                player.sendMessage('\xa7eUsage\xa7f: \n    ' + this.syntax.join('\n'));
            },
            func: function(a, player) {
                let
                    b = a[0]?.trim()?.toLowerCase(),
                    c = a[1]?.trim()?.toLowerCase()

                for (let i = 0; i < 100; i++) { // clear the chat by sending a bunch of empty messages
                    s.world.sendMessage(' ');
                }
                s.world.sendMessage(`\xa7i\xa7o${player.name} has cleared the chat.`);
            }
        }
    ],
    ncb.on_load();
    ncb.on_tick();
})
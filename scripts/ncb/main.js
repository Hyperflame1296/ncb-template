/** @format */

import * as s from '@minecraft/server'
import * as ui from '@minecraft/server-ui'
import * as gt from '@minecraft/server-gametest'
import * as cmn from '@minecraft/common'
import * as dbg from '@minecraft/debug-utilities'

/*
    ncb template v0.1.3.rev0
    template for making mods using ncb (new codebase)
*/

let ncb = {
	ver: 'v0.1.3.rev0',
	methods: {
		isOp: function (player) {
			// wrap the operator check, to make things easier
			if (player.commandPermissionLevel >= 2) return true
			return false
		},
		rankText: function (player) {
			return ncb.ranks[player.name]
				? ncb.ranks[player.name].map((r) => `§i[§${r.colorCode}${r.text}\xa7i]\xa7r`).join(' ') + '\xa7r '
				: ''
		}
	},
	ranks: {
		// example:
		/*
        TensiveYT: [
            {
                colorCode: '6',
                text: 'Owner'
            },
            {
                colorCode: 'a',
                text: 'Penguin'
            }
        ]
        */
	},
	worldListeners: {
		beforeEvents: {
			chatSend: function (e) {
				e.cancel = true
				// 256 max characters
				if (e.message.length > 256) {
					e.sender.sendMessage(`§cYou can\'t send a message that long§f! §f(§c${e.message.length} §f>§c 256§f)`)
					return
				}
				// makes it so you can't use §k in chat
				if (e.message.includes('§k')) {
					e.sender.sendMessage(`§cYou can\'t use that formatting code in chat§f!`)
					return
				}
				s.world.sendMessage(`${ncb.methods.rankText(e.sender)}${e.sender.name} §i»§r ${e.message}`) // send the message globally
			}
		},
		afterEvents: {}
	},
	systemListeners: {
		beforeEvents: {},
		afterEvents: {}
	},
	onTick: function () {
		// runs every game tick
	},
	onReload: function () {
		// runs when the script is loaded
		s.world.sendMessage(`§i[§eNCB§i] §fscript reloaded!`)
	}
}
s.world.afterEvents.worldLoad.subscribe(() => {
	for (let key of Object.keys(ncb.worldListeners.beforeEvents))
		s.world.beforeEvents[key].subscribe(ncb.worldListeners.beforeEvents[key])

	for (let key of Object.keys(ncb.worldListeners.afterEvents))
		s.world.afterEvents[key].subscribe(ncb.worldListeners.afterEvents[key])

	for (let key of Object.keys(ncb.systemListeners.beforeEvents))
		s.system.beforeEvents[key].subscribe(ncb.systemListeners.beforeEvents[key])

	for (let key of Object.keys(ncb.systemListeners.afterEvents))
		s.system.afterEvents[key].subscribe(ncb.systemListeners.afterEvents[key])

	ncb.dimensions = {
		overworld: s.world.getDimension('minecraft:overworld'),
		nether: s.world.getDimension('minecraft:nether'),
		end: s.world.getDimension('minecraft:the_end')
	}
	ncb.onReload()
	s.system.runInterval(ncb.onTick)
})
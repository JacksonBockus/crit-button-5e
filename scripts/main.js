const MODULE_NAME = "crit-button-5e"
Hooks.on("createChatMessage", (message, options, userId) => {
	let content = $(message.data.content);
	if (!game.actors.get(content.attr('data-actor-id'))?.items.get(content.attr('data-item-id'))?.hasAttack) return;

	let damageButtons = content.find("[data-action=damage],[data-action=versatile], [data-action=formula-group]");
	damageButtons.css("width", "85%");
	damageButtons.attr("data-non-crit", "1");
	for (button of damageButtons) {
		critButton= $(button).clone();
		critButton.css("width", "15%");
		critButton.html("Crit");
		critButton.removeAttr("data-non-crit")
		critButton.attr("data-crit", "1");
		$(button).after(critButton);
	}

	message.update({content: content.prop("outerHTML")})
})

Hooks.on("ready", () => {
	libWrapper.register(MODULE_NAME, "CONFIG.Item.documentClass.prototype.rollDamage", async function (wrapped, config) {
		if (config.event?.currentTarget?.dataset?.crit) {
			config.critical = true;
			if (config.options) {
				config.options.fastForward = true;
			} else {
				config.options = {fastForward: true};
			}
		} else if (config.event?.currentTarget?.dataset?.nonCrit) {
			config.critical = false;
			if (config.options) {
				config.options.fastForward = true;
			} else {
				config.options = {fastForward: true};
			}
		}
		wrapped(config);
	}, "WRAPPER");
});
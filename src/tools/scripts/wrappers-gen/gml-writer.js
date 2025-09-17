export function writeGmlScript({ namespace, enums, wrappers, jsdocConfig }) {
    /// TODO: SAMPLE... Refer to toGML and toJsdoc
	let lines = [`/// @namespace ${namespace}`, ""]

	for (const en of enums) {
		lines.push(`/// @enum ${en.name}`)
		for (const entry of en.entries) {
			lines.push(`${en.name}_${entry} = ${entry};`)
		}
		lines.push("")
	}

	for (const fn of wrappers) {
		// lines.push(fn.toGMExtensionFunction())
		lines.push(fn.toGML(1, false))
		// if (jsdocConfig.enabled) {
		// 	lines.push(`/// @function ${fn.name}`)
		// 	if (fn.comment) lines.push(`/// ${fn.comment}`)
		// }
		// lines.push(`${fn.name} = function(${fn.args.join(", ")}) {`)
		// lines.push(`    // TODO: implement wrapper logic`)
		// lines.push("};")
		// lines.push("")
	}

	return lines.join("\n")
}

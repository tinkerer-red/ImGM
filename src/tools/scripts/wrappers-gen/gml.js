import path from "path"
import { Program } from "../../lib/program.js"
import { writeGmlScript } from "./gml-writer.js" // hypothetical module
import File from "../../lib/class/file.js"

const Logger = Program.Logger

export async function updateGmlScripts(fullApi, config) {
	Logger.info("Updating GML scripts...")

	const namespaceGroups = {}

	// Group wrappers and enums by namespace
	for (const wrapper of fullApi.wrappers) {
		const ns = wrapper.namespace ?? "ImGui"
		if (!namespaceGroups[ns])
			namespaceGroups[ns] = { wrappers: [], enums: [] }
		namespaceGroups[ns].wrappers.push(wrapper)
	}

	for (const en of fullApi.enums) {
		const ns = en.namespace ?? "ImGui"
		if (!namespaceGroups[ns])
			namespaceGroups[ns] = { wrappers: [], enums: [] }
		namespaceGroups[ns].enums.push(en)
	}

	// Write each namespace group to its own GML file
	for (const [namespace, group] of Object.entries(namespaceGroups)) {
		const scriptPath = path.join("tests/gm", "scripts", `${namespace}.gml`)
		const file = new File(scriptPath)

		const jsdocConfig = config.jsdoc ?? {}
		const content = writeGmlScript({
			namespace,
			enums: group.enums,
			wrappers: group.wrappers,
			jsdocConfig,
		})

		file.update(content)
		file.commit()

		Logger.info(`Updated script: ${scriptPath}`)
	}
}

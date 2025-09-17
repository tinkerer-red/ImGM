import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import config from "../../config.js"
import { Program } from "../program.js"
import ImGMError from "./error.js"

const Logger = Program.Logger

/**
 * Represents a file that can be read, modified in memory, and written to disk.
 *
 * @export
 * @class File
 */
export default class File {
	/**
	 * @param {string} filepath Absolute or relative path to the file
	 * @param {boolean} readonly Whether the file is immutable
	 */
	constructor(filepath, readonly = false) {
		this.path = path.resolve(filepath)
		this.name = path.basename(this.path)
		this.immutable = readonly

		if (!fs.existsSync(this.path)) {
			throw new ImGMError(
				`File "${this.name}" does not exist at ${this.path}`
			)
		}

		this._loadContent()
		Logger.info(
			`Loaded "${this.name}" (${this.lines} lines, ${this.size} characters)`
		)
	}

	_loadContent() {
		this.content = fs.readFileSync(this.path, "utf-8")
		this.hash = this._hash(this.content)
		this.size = this.content.length
		this.lines = (this.content.match(/\n/g) ?? []).length
		this.changed = false
	}

	_hash(value) {
		return crypto.createHash("md5").update(value).digest("hex")
	}

	_precheck() {
		if (this.immutable) {
			throw new ImGMError(`File "${this.name}" is marked as immutable`)
		}
	}

	prepend(value) {
		this._precheck()
		this.content = value + this.content
		this.changed = true
	}

	append(value) {
		this._precheck()
		this.content += value
		this.changed = true
	}

	update(value) {
		this._precheck()
		const newHash = this._hash(value)
		if (newHash === this.hash) {
			Logger.info(
				`Skipping update for "${this.name}", no changes detected`
			)
			return false
		}

		this.content = value
		this.hash = newHash
		this.changed = true
		return true
	}

	commit() {
		if (!this.changed) {
			Logger.info(
				`Skipping write for "${this.name}", no changes detected`
			)
			return false
		}

		this._precheck()

		const outputPath = this.path + (config.useTest ? ".test" : "")
		try {
			fs.writeFileSync(outputPath, this.content, "utf-8")
			this.hash = this._hash(this.content)
		} catch (err) {
			Logger.error(`Failed to write "${this.name}": ${err}`)
			return false
		}

		const newSize = this.content.length
		const newLines = (this.content.match(/\n/g) ?? []).length
		const charDiff = newSize - this.size
		const lineDiff = newLines - this.lines

		Logger.info(
			`Wrote "${this.name}" (${lineDiff >= 0 ? "+" : ""}${lineDiff} lines, ${charDiff >= 0 ? "+" : ""}${charDiff} characters)`
		)

		this.size = newSize
		this.lines = newLines
		this.changed = false
		return true
	}
}

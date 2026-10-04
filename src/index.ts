import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  let willCommit = false;

  pi.registerCommand("willCommit", {
		description: "Toggles the willCommit boolean. On true it will commit every change after a edit or write.",
		handler: async (_, ctx) => {
      willCommit = !willCommit;
      if (willCommit) {
        ctx.ui.notify(`All changes will now be automatically commited.`, "info");
        return
      }
      ctx.ui.notify(`No changes will be automatically commited.`, "info");
		},
	});

  pi.on("tool_execution_end", async (event, ctx) => {
    if (willCommit && (event.toolName === "edit" || event.toolName === "write")) {
      const steps = [
        "git add .",
        `git ls-files --deleted -z | xargs -0 -r git rm --`,
        `git commit -m 'pi write'`,
      ];

      for (const cmd of steps) {
        const result = await pi.exec("bash", ["-lc", cmd]);
        if (result.code !== 0) {
          ctx.ui.notify(`Git step '${cmd}' failed: ${result.stderr}`, "warning");
          return;
        }
      }
    }
  });
}

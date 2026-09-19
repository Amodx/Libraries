import fs from "fs/promises";
import path from "path";
(async () => {
  const packageJSON = JSON.parse(await fs.readFile("../package.json", "utf-8"));

  const directory = await fs.readdir(path.join(import.meta.dirname, "../../"));

  await fs.mkdir("../src", { recursive: true });
  const existing = await fs.readdir("../src", { withFileTypes: true });
  for (const entry of existing) {
    if (entry.isDirectory()) {
      await fs.rm(path.join("../src", entry.name), {
        recursive: true,
        force: true,
      });
    }
  }

  const packageVersions = {};
  let finalIndex = "";
  for (const folder of directory) {
    if (folder == "suite") continue;

    const packageJSON = JSON.parse(
      await fs.readFile(
        path.join(import.meta.dirname, "../../", folder, "package.json"),
        "utf-8",
      ),
    );
    const packageName = packageJSON.name.replace("@amodx/", "");
    await fs.mkdir(`../src/${packageName}`, { recursive: true });
    const indexFile = `export * from "${packageJSON.name}";`;
    finalIndex += `${indexFile}\n`;
    await fs.writeFile(`../src/${packageName}/index.ts`, indexFile);
    console.log(packageJSON.name, packageJSON.version);
    packageVersions[packageJSON.name] = packageJSON.version;
  }
  await fs.writeFile(`../src/index.ts`, finalIndex);
  packageJSON.dependencies = packageVersions;
  console.log(packageJSON);
  await fs.writeFile("../package.json", JSON.stringify(packageJSON, null, 1));
})();
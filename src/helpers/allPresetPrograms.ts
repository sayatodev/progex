import fs from "node:fs";

export default async function getAllPresetPrograms(): Promise<ProgramLink[]> {
    const dir = "./src/data/preset_programs/";
    const files = fs.readdirSync(dir);
    const programs = files.filter((file) => file.endsWith(".json"));
    const result = [];
    for (const program of programs) {
        const rawData = fs.readFileSync(dir + program, "utf-8");
        const data = JSON.parse(rawData) as ProgramData;
        const url = "/view/preset/" + program.replace(".json", "");
        result.push({
            name: data.title,
            url: url,
        });
    }
    return result;
}

import fs from 'node:fs'
import path from 'node:path'
import type { Score } from '@/src/interfaces'

export default function fileReporter(scores: Score[], outputFile = 'scores.json') {
  const jsonContent = JSON.stringify(scores, null, 2)

  // Write to the main scores file
  fs.writeFileSync(outputFile, jsonContent)

  // Write to timestamped file in scores/ folder
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')
  const timestampedFilename = `scores-${timestamp}.json`
  const scoresDir = 'scores'

  // Ensure scores directory exists
  if (!fs.existsSync(scoresDir)) {
    fs.mkdirSync(scoresDir, { recursive: true })
  }

  fs.writeFileSync(path.join(scoresDir, timestampedFilename), jsonContent)
}

import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import prompts from 'prompts'

import type { ServiceOptions } from './types/service-options'
import { progress, ProgressEvent } from './cli/progress'
import { ExitCode } from './cli'
import {
  cwd,
  type Framework,
  FRAMEWORKS,
  getTemplateDir,
  TEMPLATES,
} from './template'
import { constructCommand, pkgInfoFromAgent, run } from './cli/detect'
import {
  copyDir,
  emptyDir,
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  toValidPackageName,
} from './fs'

export async function serviceTemplate(options: ServiceOptions) {
  // prompt to chocie project name if not pass
  const defualtTargetDir = 'service-project'
  let targetDir = options.targetDir
  if (!targetDir) {
    const response = await prompts({
      type: 'text',
      message: 'Prject name:',
      name: 'targetDir',
      initial: defualtTargetDir,
    })
    targetDir = formatTargetDir(response.targetDir)
  }

  // handle directory if exist and not empty
  if (fs.existsSync(targetDir) && !isEmpty(targetDir)) {
    const overwrite =
      options.overwrite ??
      (
        await prompts({
          type: 'select',
          name: 'overwrite',
          message:
            (targetDir === '.'
              ? 'currenty directory'
              : `Target directory "${targetDir}`) +
            ` is not empty. Please choose hot to proceed:`,
          choices: [
            {
              title: 'Cancel operation',
              value: 'cancel',
            },
            {
              title: 'Remove existing files and continue',
              value: 'remove',
            },
            {
              title: 'Ingore files and continue',
              value: 'ignore',
            },
          ],
        })
      ).overwrite

    switch (overwrite) {
      case 'remove':
        emptyDir(targetDir)
        break
      case 'cancel':
        process.exit(ExitCode.Success)
        break
    }
  }

  // -invalid-name .invalidname _invalidname @scope/ invalid..name InvalidName
  // 123-invalid valid~name valid_name valid.name valid-name
  let packageName = path.basename(path.resolve(targetDir))
  if (!isValidPackageName(packageName)) {
    const packageNameResult = await prompts({
      type: 'text',
      message: 'Package name: ',
      initial: toValidPackageName(packageName),
      name: 'packageName',
      validate(dir) {
        // Receive user input. Should return true if the value is valid, and an error message String otherwise
        if (!isValidPackageName(dir)) {
          return 'Invalide package.json name'
        }
        return true
      },
    })
    packageName = packageNameResult.packageName
  }

  let template = options.template
  let hasInnvalidTemplate = false
  // check for templatei is passed and valid
  if (template && !TEMPLATES.includes(template)) {
    template = undefined
    hasInnvalidTemplate = true
  }

  if (!template) {
    const { framework } = (await prompts({
      type: 'select',
      name: 'framework',
      message: hasInnvalidTemplate
        ? `"${template}" isn't a valid tempalte. Please choose from below:`
        : 'Select a framework',
      choices: FRAMEWORKS.map((f) => {
        return {
          title: f.color(f.display || f.name),
          value: f,
        }
      }),
    })) as { framework: Framework }

    const { variant } = (await prompts({
      type: 'select',
      name: 'variant',
      message: 'Select a framework:',
      choices: framework.variants.map((v) => {
        return {
          title: v.color(v.display || v.name),
          value: v.name,
        }
      }),
    })) as { variant: string }

    template = variant
  }

  const pkgInfo = pkgInfoFromAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.agent : 'npm'
  const { customCommand, repoUrl } =
    FRAMEWORKS.flatMap((f) => f.variants).find((v) => v.name === template) ?? {}

  // run create cli
  if (customCommand) {
    progress(ProgressEvent.CloneRepo, 'exeucting the command...')

    const [command, ...args] = constructCommand(customCommand, pkgInfo)
    // replace template
    const replacedArgs = args.map((arg) =>
      arg.replace('TARGET_DIR', () => targetDir)
    )
    const { exitCode } = await run(command, replacedArgs)
    process.exit(exitCode ?? ExitCode.Success)
  }
  // pull repo
  // @tag #commit-hash #branch_name
  // private repo git+ssh://git@github.com:user_name/node_project.git
  // public repo  https://github.com/{USER}/{REPO}/tarball/{BRANCH}
  // sparse checkout https://github.com/orgs/community/discussions/102639
  else if (repoUrl) {
    // construct/ build up arg
    progress(ProgressEvent.CloneRepo, 'cloning the repo...')
    const { exitCode } = await run('git', ['clone', repoUrl, targetDir])
    if (exitCode === ExitCode.Success) {
      const doneMessage = genDoneMessage(cwd, targetDir, pkgManager)
      progress(ProgressEvent.PrintDoneMessage, doneMessage)
    }
    process.exit(exitCode ?? ExitCode.Success)
  }

  // copy template folder
  else {
    const templateDir = getTemplateDir(template)
    copyDir(templateDir, targetDir)
    const doneMessage = genDoneMessage(cwd, targetDir, pkgManager)

    progress(ProgressEvent.PrintDoneMessage, doneMessage)
  }
}

function genDoneMessage(cwd: string, targetDir: string, pkgManager: string) {
  let doneMessage = 'Done. Now run:\n'
  const root = path.resolve(cwd, targetDir)
  const dirToChange = path.relative(cwd, root)
  if (root !== cwd) {
    doneMessage += `\ncd ${dirToChange}`
  }
  switch (pkgManager) {
    case 'yarn':
      doneMessage += '\n  yarn'
      doneMessage += '\n  yarn dev'
      break
    default:
      doneMessage += `\n  ${pkgManager} install`
      doneMessage += `\n  ${pkgManager} dev`
      break
  }
  return doneMessage
}

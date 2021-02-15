# ProjectCli

These are meant to be a small set of cli tools that can make it easier to generate and view task details.

## Commands

After the package has been installed or registered with lerna or yarn workspaces

You can just run commands `yarn task_open` or `yarn branch_gen`

### task_open

Just run this in a properly named branch and this will open the task in storagetreasures devops boards.

### branch_gen

`yarn branch:gen `

Example

`yarn branch_gen` <task_id> <description> <switches>

`yarn branch_gen 1234 "short description. I like to use the task title" -g`

-g will generate or checkout to the branch

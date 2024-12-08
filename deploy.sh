#!/bin/bash

rm nohup.out

pkill -f debugger
export PYTHONPATH="/home/tosha/structs.sh/.venv/lib/python3.11/site-packages:/home/tosha/structs.sh/debugger"
nohup /home/tosha/structs.sh/.venv/bin/python3.11 /home/tosha/structs.sh/debugger/src/server.py &

pkill -f '/home/tosha/structs.sh/client/node_modules/.bin/vite'
nohup npm run start --prefix /home/tosha/structs.sh/client &

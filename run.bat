@ECHO OFF

set WORKDIR=%~dp0

cd src
FOR /R %%s IN (*.lua) DO ( 
    ECHO %%s 
    node %WORKDIR%app %%s 
)

PAUSE
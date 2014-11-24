@echo on>out.txt
@echo off
setlocal enabledelayedexpansion
set "parentfolder=%CD%"
echo var icon_files_hash = { >> out.txt
for /r . %%g in (*.*) do (
  set "var=%%g"
  set var=!var:%parentfolder%=!
  echo "!var!":1, >> out.txt
)
echo } >> out.txt
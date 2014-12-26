@echo off
set nwpath=D:\node-webkit\
if not exist "package.json" (
 echo Can't find package.json, run bat in project's directory.
 exit /B
)

echo Compressing...
7z a -tzip my-app.nw * -xr!?git\* -xr!build\* -xr!*.bat -mx0
echo Copy dependent files.
copy %nwpath%nw.pak nw.pak
copy %nwpath%icudtl.dat icudtl.dat
echo %nwpath%icudtl.dat icudtl.dat
echo Create build directory.
mkdir build
echo Building...
copy /b %nwpath%nw.exe+my-app.nw build\lottery.exe
copy nw.pak build\nw.pak
copy icudtl.dat build\icudtl.dat
echo Delete files.
del nw.pak
del icudtl.dat
del my-app.nw
echo Everything is ok.
pause
; BioDockViz NSIS Installer Script
; Version: 1.0.0
; Author: BioDockViz Labs
; Target: Windows 10/11 x64

Unicode true
SetCompressor /SOLID lzma
SetCompressorDictSize 32
SetDatablockOptimize on
CRCCheck on

!include "MUI2.nsh"
!include "x64.nsh"
!include "FileFunc.nsh"

Name "BioDockViz"
OutFile "BioDockViz-Setup-1.0.1.exe"
InstallDir "$PROGRAMFILES64\BioDockViz"
InstallDirRegKey HKLM "Software\BioDockViz" "InstallDir"
RequestExecutionLevel admin
ShowInstDetails show

VIProductVersion "1.0.1.0"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName" "BioDockViz"
VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName" "BioDockViz Labs"
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription" "Molecular Visualization Platform"
VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright" "© 2024 BioDockViz Labs"
VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion" "1.0.1"
VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductVersion" "1.0.1"

Var StartMenuFolder

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "BioDockViz Core" SEC01
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  SetOutPath "$INSTDIR"
  
  ; Packaged Backend Executable
  File "backend\dist\BioDockViz.exe"
  
  ; License
  File "LICENSE"
  
  ; Frontend Static Files
  SetOutPath "$INSTDIR\frontend_dist"
  File /r "frontend\out\*.*"
  
  SetOutPath "$INSTDIR"
  
  WriteRegStr HKLM "Software\BioDockViz" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\BioDockViz" "Version" "1.0.0"
  
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "DisplayName" "BioDockViz"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "DisplayVersion" "1.0.0"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "Publisher" "BioDockViz Labs"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz" "NoRepair" 1
  
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  CreateDirectory "$SMPROGRAMS\BioDockViz"
  CreateShortCut "$SMPROGRAMS\BioDockViz\BioDockViz.lnk" "$INSTDIR\BioDockViz.exe"
  CreateShortCut "$SMPROGRAMS\BioDockViz\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  CreateShortCut "$DESKTOP\BioDockViz.lnk" "$INSTDIR\BioDockViz.exe"
  
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\uninstall.exe"
  Delete "$SMPROGRAMS\BioDockViz\BioDockViz.lnk"
  Delete "$SMPROGRAMS\BioDockViz\Uninstall.lnk"
  Delete "$DESKTOP\BioDockViz.lnk"
  RMDir "$SMPROGRAMS\BioDockViz"
  
  RMDir /r "$INSTDIR\backend"
  RMDir /r "$INSTDIR\frontend"
  RMDir "$INSTDIR"
  
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioDockViz"
  DeleteRegKey HKLM "Software\BioDockViz"
  
SectionEnd

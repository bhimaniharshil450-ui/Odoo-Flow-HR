@echo off
echo Initializing Git...
git init
git add .
git commit -m "Initial commit - OdooFlow HR"
git branch -M main
git remote remove origin
git remote add origin https://github.com/bhimaniharshil450-ui/Odoo-Flow-HR.git
echo Pushing to GitHub...
git push -u origin main
echo Done.
pause

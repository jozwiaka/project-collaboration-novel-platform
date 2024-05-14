# Remove node_modules directory
Remove-Item -Path "node_modules" -Recurse -Force

# Clear npm cache
npm cache clean --force

# Reinstall npm modules
npm install

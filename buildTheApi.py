#copy baseCode
#for each object
#   make a copy of objects.js and do the apropriate things (rename routes, etc)
#   make objectFields in constants.js
#   add route to server imports
#iterate through every file and update all <<>> things


# Python program to explain shutil.copytree() method
	
# importing os module
import os

# importing shutil module
import shutil

# path
path = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/'
# Source path
src = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/baseCode'
# Destination path
dest = 'C:/Users/ethan/Dropbox/PC/Documents/PersonalProjects/Automated-APIs/newAPICode'


# List files and directories in path
print("Before copying file:")
print(os.listdir(path))


# Copy the content from source to destination
destination = shutil.copytree(src, dest)

# List files and directories in path
print("After copying file:")
print(os.listdir(path))

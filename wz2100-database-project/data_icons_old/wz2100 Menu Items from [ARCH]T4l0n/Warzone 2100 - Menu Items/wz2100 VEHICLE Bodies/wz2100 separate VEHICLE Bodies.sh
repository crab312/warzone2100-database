#!/bin/bash
echo -e "\e[93mCreating directory \e[97m'wz2100 VEHICLE Bodies separated'\e[93m in your home directory."
mkdir "$HOME/wz2100 VEHICLE Bodies separated"
echo -e "\e[93mExtracting images using ImageMagick to the folder previously created."
convert "b1 Base.png" -crop 60x46+3+52\!   -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 L-A Tiger.tif"
convert "b1 Base.png" -crop 60x46+3+100\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 L-B Retribution.tif"
convert "b1 Base.png" -crop 60x46+3+148\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 L-C Cobra.tif"
convert "b1 Base.png" -crop 60x46+3+196\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 L-D Retaliation.tif"
convert "b1 Base.png" -crop 60x46+65+52\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 R-A Scorpion.tif"
convert "b1 Base.png" -crop 60x46+65+100\! -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 R-B Panther.tif"
convert "b1 Base.png" -crop 60x46+65+148\! -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 R-C Bug.tif"
convert "b1 Base.png" -crop 60x46+65+196\! -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b1 R-D Leopard.tif"
convert "b2 Base.png" -crop 60x46+3+52\!   -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 L-A Viper.tif"
convert "b2 Base.png" -crop 60x46+3+100\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 L-B Wyvern.tif"
convert "b2 Base.png" -crop 60x46+3+148\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 L-C Python.tif"
convert "b2 Base.png" -crop 60x46+65+52\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 R-A Dragon.tif"
convert "b2 Base.png" -crop 60x46+65+100\! -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 R-B Mantis.tif"
convert "b2 Base.png" -crop 60x46+65+148\! -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b2 R-C Vengeance.tif"
convert "b3 Base.png" -crop 60x46+3+30\!   -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b3 L-A Cyborg Transport.tiff"
convert "b3 Base.png" -crop 60x46+65+30\!  -channel rgba -fill none -opaque "#080840" "$HOME/wz2100 VEHICLE Bodies separated/b3 R-A Super Transport.tiff"
echo -e "\e[93mCoping script \e[97m'wz2100 rename VEHICLE Bodies.sh'\e[93m to the folder previously created."
cp "wz2100 rename VEHICLE Bodies.sh" "$HOME/wz2100 VEHICLE Bodies separated"
echo -e "\e[92mBatch process completed!"
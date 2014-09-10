#!/bin/bash

# Run this script as root ie:
# wget -O - https://bitbucket.org/dolink/tools/raw/master/scripts/install.sh | sudo bash

set -e

bold=`tput bold`;
normal=`tput sgr0`;
space_left=`df | grep rootfs | awk '{print $3}'`

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

if [[ ${space_left} -lt 100000 ]]
then
	echo "${bold} In order to install the ollo software, you must have at least 100 megs of free space. Try running raspi-config and using the \"expand_rootfs\" option to free up some space ${normal}"
	exit 1
fi

# Updating apt-get
echo -e "\n→ ${bold}Updating apt-get${normal}\n";
sudo apt-get update > /dev/null;

echo -e "\n→ ${bold}Installing python-software-properties${normal}\n";
sudo apt-get -qq -y -f -m install python-software-properties > /dev/null;

echo -e "\n→ ${bold}Installing ntpdate${normal}\n";
sudo apt-get -qq -y -f -m install ntpdate > /dev/null;
sudo /etc/init.d/ntp stop

# Add NTP Update as a daily cron job
echo -e "\n→ ${bold}Create the ntpdate file${normal}\n";
sudo touch /etc/cron.daily/ntpdate;
echo -e "\n→ ${bold}Add ntpdate ntp.ubuntu.com${normal}\n";
sudo echo "ntpdate ntp.ubuntu.com" > /etc/cron.daily/ntpdate;
echo -e "\n→ ${bold}Making ntpdate executable${normal}\n";
sudo chmod 755 /etc/cron.daily/ntpdate;


# Update the timedate
echo -e "\n→ ${bold}Updating the time${normal}\n";
sudo ntpdate ntp.ubuntu.com pool.ntp.org;
sudo /etc/init.d/ntp start

###################################################################
# Download and install the Essential packages
###################################################################

echo -e "\n→ ${bold}Installing avahi-daemon${normal}\n";
sudo apt-get -qq -y -f -m  install avahi-daemon > /dev/null;

echo -e "\n→ ${bold}Installing upstart${normal}\n";
echo 'Yes, do as I say!' | sudo apt-get -o DPkg::options=--force-remove-essential -y --force-yes install upstart > /dev/null;

# Download and install the Essential packages.
echo -e "\n→ ${bold}Installing git${normal}\n";
sudo apt-get -qq -y -f -m  install git > /dev/null;

echo -e "\n→ ${bold}Installing node & npm${normal}\n";
cd /tmp
rm -f node_latest_armhf.*
# wget http://nodejs.org/dist/latest/node-v0.10.26-linux-arm-pi.tar.gz
# cd /usr/local
# sudo tar xzvf ~/node-v0.10.26-linux-arm-pi.tar.gz  --strip=1
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb > /dev/null;
rm -f node_latest_armhf.*

echo -e "\n→ ${bold}Installing ruby1.9.1-dev${normal}\n";
sudo apt-get -qq -y -f -m  install ruby1.9.1-dev > /dev/null;

echo -e "\n→ ${bold}Installing avrdude${normal}\n";
sudo apt-get -qq -y -f -m  install avrdude > /dev/null;

echo -e "\n→ ${bold}Installing psmisc${normal}\n";
sudo apt-get -qq -y -f -m  install psmisc > /dev/null;

echo -e "\n→ ${bold}Installing curl${normal}\n";
sudo apt-get -qq -y -f -m  install curl > /dev/null;

# Install Sinatra
echo -e "\n→ ${bold}Installing the sinatra gem${normal}\n";
sudo gem install sinatra  --verbose --no-rdoc --no-ri > /dev/null;

# Install getifaddrs
echo -e "\n→ ${bold}Installing the getifaddrs gem${normal}\n";
sudo gem install system-getifaddrs  --verbose --no-rdoc --no-ri > /dev/null;

# Install gpac
echo -e "\n→ ${bold}Installing gpac${normal}\n";
sudo apt-get -qq -y -f -m install gpac > /dev/null;

###################################################################
# Glone Setup
###################################################################

# Create the Dolink setup folder
echo -e "\n→ ${bold}Create the Dolink Setup Folder${normal}\n";
sudo mkdir -p  ~/setup;

# Clone the Ninja Utilities into ~/setup
echo -e "\n→ ${bold}Fetching the Setup Repo from Github${normal}\n";
git clone https://github.com/dolink/setup.git ~/setup > /dev/null;
cd ~/setup;
git checkout master; #this will change once release is finished

# Install Node Packages
npm install

# Run install.js
sudo node install.js
/*
	This file is part of 'Warzone 2100 Guide by crab'.

	'Warzone 2100 Guide by crab' is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	'Warzone 2100 Guide by crab' is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with 'Warzone 2100 Guide by crab'; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/
var properties_description = {};

function num_format(value, precision) {
    if (precision == undefined) {
        precision = 0;
    }
    if (value == undefined) {
        return 0;
    } else {
        if (typeof value != 'number') {
            value = parseInt(value);
        }
        var pw = Math.pow(10, precision);
        return Math.floor(value * pw) / pw;
    }
}

function str_format(value, precision) {

    if (precision == undefined) {
        precision = 0;
    }
    if (value == undefined) {
        return ' - ';
    } else {
        if (typeof value == 'number') {
            if (isNaN(value)) {
                return ' - ';
            }
            var pw = Math.pow(10, precision);
            return Math.floor(value * pw) / pw;
        } else {
            return value;
        }
        
    }
}

$(function () {

    /* WEAPON */
    {
        var p = "periodicalDamageTime"
        var d = {};
        d.short_name = "Period. Time";
        d.name = "Periodical Damage Time";
        d.description = "Time of Periodical Damage, 1/10 sec";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "periodicalDamageRadius"
        var d = {};
        d.short_name = "Period. Radius";
        d.name = "Periodical Damage Radius";
        d.description = "Radius of Periodical Damage /points (1/128 oof Tile)";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "periodicalDamage"
        var d = {};
        d.short_name = "Period. Damage";
        d.name = "Periodical Damage";
        d.description = "Damage per second. Applies only to enemy units which are in the area of effect (see Periodical Damage Radius). This damage more often applies to light bodies because they are smaller and it is easier to be 'in area' for them.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "radiusDamage"
        var d = {};
        d.short_name = "Splash Damage";
        d.name = "Splash (radius) Damage";
        d.description = "Additional splash damage. Applies only to enemy units which are in the area of effect (see Radius). This damage does not applies to target of attack, this damage inflicts only secondary targets.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }
    
    {
        var p = "radius"
        var d = {};
        d.short_name = "Splash Radius";
        d.name = "Splash Radius";
        d.description = "Radius of Splash Damage /points (1/128 of Tile). Applies only to enemy units which are in the area of effect (see Splash Radius). This damage does not applies to target of attack, this damage inflicts only secondary targets.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "shotsPerMinute"
        var d = {};
        d.short_name = "Shots /min";
        d.name = "Shots per minute (Rate-Of-Fire)";
        d.description = "Average number of shots per minute.";
        d.format_str = function (value) {
            return str_format(value, 1);
        };
        d.format_num = function (value) {
            return num_format(value, 1);
        };
        properties_description[p] = d;
    }

    {
        var p = "longRange"
        var d = {};
        d.short_name = "Range";
        d.name = "Range (1/128 of Tile)";
        d.description = "Maximum range of fire.";
        d.format_str = function (value) {
            return str_format(value, 1);
        };
        d.format_num = function (value) {
            return num_format(value, 1);
        };
        properties_description[p] = d;
    }

    {
        var p = "longRange_tiles"
        var d = {};
        d.short_name = "Range";
        d.name = "Range (tiles)";
        d.description = "Maximum range of fire.";
        d.format_str = function (value) {
            return str_format(value / 128, 1);
        };
        d.format_num = function (value) {
            return num_format(value/128, 1);
        };
        properties_description[p] = d;
    }
    

    {
        var p = "vtol_numShots"
        var d = {};
        d.short_name = "VTOL ammo";
        d.name = "VTOL ammo (count of shots per reload)";
        d.description = "VTOL ammo (count of shots per reload)";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "weaponClass"
        var d = {};
        d.short_name = "Damage Type";
        d.name = "Damage Type";
        d.description = "Kinetic damage or Heat damage.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "damage"
        var d = {};
        d.short_name = "Damage";
        d.name = "Damage";
        d.description = "Amount of damage per shot.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "firePause"
        var d = {};
        d.short_name = "Firepause";
        d.name = "Firepause 1/10 sec";
        d.description = "Pause between two shots 1/10 sec.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "reloadTime"
        var d = {};
        d.short_name = "Reload Pause";
        d.name = "Reload Pause 1/10 sec";
        d.description = "Pause between two shots. Applicable only to 'salvo' weapons (lancer, ripples).";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }


    /* HP, ARMOR */
    {
        var p = "armourKinetic"
        var d = {};
        d.short_name = "Kinet. Armor";
        d.name = "Armor (kinetic)";
        d.description = "Physical armor.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "armourHeat"
        var d = {};
        d.short_name = "Heat Armor";
        d.name = "Armor (thermal, heat)";
        d.description = "Thermal armor.";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    /* SPEED */
    {
        var p = "speed_road"
        var d = {};
        d.short_name = "Speed (road)";
        d.name = "Speed (road)";
        d.description = "Speed on road terrain (in Warzone2100 hardcrete also considered as road)";
        d.format_str = function (value) {
            return str_format(value, 2);
        };
        d.format_num = function (value) {
            return num_format(value, 2);
        };
        properties_description[p] = d;
    }

    {
        var p = "speed_offroad"
        var d = {};
        d.short_name = "Speed (off-road)";
        d.name = "Speed (off-road)";
        d.description = "Speed on terrain 'SANDY_BUSH'";
        d.format_str = function (value) {
            return str_format(value, 2);
        };
        d.format_num = function (value) {
            return num_format(value, 2);
        };
        properties_description[p] = d;
    }

    {
        var p = "speed_bonus"
        var d = {};
        d.short_name = "Speed bonus";
        d.name = "Speed bonus (hardcoded)";
        d.description = "This bonus can increase total power output of engine of Tank Design. This bonus equal to 1.5 if tank weight lesser than power of engine of rank body.";
        d.format_str = function (value) {
            return str_format(value, 1);
        };
        d.format_num = function (value) {
            return num_format(value, 1);
        };
        properties_description[p] = d;
    }

    /* Price, build time */
    {
        var p = "price"
        var d = {};
        d.short_name = "Price";
        d.name = "Price";
        d.description = "Price";
        d.format_str = function (value) {
            return '$' + str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        d.format_html = function (value) {
            return '<span style="color:darkgreen">' + this.format_str(value) + '</span>';
        }
        properties_description[p] = d;
    }

    {
        var p = "buildPoints"
        var d = {};
        d.short_name = "Build Points";
        d.name = "Build Points";
        d.description = "Time require to produce component. Each build point is equal to some time value (like 1/14 of second)";
        d.format_str = function (value) {
            return str_format(value, 0);
        };
        d.format_num = function (value) {
            return num_format(value, 0);
        };
        properties_description[p] = d;
    }

    {
        var p = "buildTimeSeconds_factory_nomodules"
        var d = {};
        d.short_name = "Build Time (no modules)";
        d.name = "Build Time (no modules)";
        d.description = "Time to produce unit in factory without modules";
        d.format_str = function (value) {
            return num_format(value, 0).toMMSS();
        };
        d.format_num = function (value) {
            return num_format(value, 0).toFixed(0);
        };
        properties_description[p] = d;
    }

    {
        var p = "buildTimeSeconds_factory_with2modules"
        var d = {};
        d.short_name = "Build Time (modules: 2)";
        d.name = "Build Time (modules: 2)";
        d.description = "Time to produce unit in factory with 2 modules";
        d.format_str = function (value) {
            return num_format(value, 0).toMMSS();
        };
        d.format_num = function (value) {
            return num_format(value, 0).toFixed(0);
        };
        properties_description[p] = d;
    }

    /* Sensor */
    {
        var p = "sensorRange"
        var d = {};
        d.short_name = "Sensor";
        d.name = "Sensor range (tiles)";
        d.description = "Range of sensor";
        d.format_str = function (value) {
            return str_format((value / 128), 1);
        };
        d.format_num = function (value) {
            return num_format((value / 128), 1);
        };
        properties_description[p] = d;
    }

});

function PropDescr(prop) {
    if (properties_description[prop] == undefined) {
        {
            var d = {};
            d.short_name = prop;
            d.name = prop;
            d.description = "";
            d.format_str = function (value) {
                return str_format(value, 0);
            };
            d.format_num = function (value) {
                return num_format(value, 0);
            };
            d.format_html = function (value) {
                return this.format_str(value);
            }
            return d;
        }
    } else {
        return properties_description[prop];
    }
}

//$(function () {
//    var WeaponFieldsDescr = {};
//    WeaponFieldsDescr.damage = '';

//});
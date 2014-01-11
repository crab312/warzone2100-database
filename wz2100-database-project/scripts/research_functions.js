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

var numCleanTech = 4;	// do x for clean	
var numBaseTech = 18; // do x for base
var techlist = new Array(
    "R-Vehicle-Prop-Wheels",
    "R-Sys-Spade1Mk1",
    "R-Vehicle-Body01",
    "R-Comp-SynapticLink",
    "R-Wpn-MG1Mk1",
    "R-Defense-HardcreteWall",
    "R-Vehicle-Prop-Wheels",
    "R-Sys-Spade1Mk1",
    "R-Struc-Factory-Cyborg",
    "R-Defense-Pillbox01",
    "R-Defense-Tower01",
    "R-Vehicle-Body01",
    "R-Sys-Engineering01",
    "R-Struc-CommandRelay",
    "R-Vehicle-Prop-Halftracks",
    "R-Comp-CommandTurret01",
    "R-Sys-Sensor-Turret01",
    "R-Wpn-Flamer01Mk1",
    "R-Vehicle-Body05",
    "R-Struc-Research-Module",
    "R-Struc-PowerModuleMk1",
    "R-Struc-Factory-Module",
    "R-Struc-RepairFacility",
    "R-Sys-MobileRepairTurret01",
    "R-Vehicle-Engine01",
    "R-Wpn-MG3Mk1",
    "R-Wpn-Cannon1Mk1",
    "R-Wpn-Mortar01Lt",
    "R-Defense-Pillbox05",
    "R-Defense-TankTrap01",
    "R-Defense-WallTower02",
    "R-Sys-Sensor-Tower01",
    "R-Defense-Pillbox04",
    "R-Wpn-MG2Mk1",
    "R-Wpn-Rocket05-MiniPod",
    "R-Wpn-MG-Damage01",
    "R-Wpn-Rocket-Damage01",
    "R-Defense-WallTower01",
    "R-Defense-Tower06");


function eventResearched(research, player) {
    //debug("RESEARCH : " + research.fullname + "(" + research.name + ") for " + player + " results=" + research.results);
    if (research.results == undefined) {
        return;
    }
    for (var v = 0; v < research.results.length; v++) {
        var s = research.results[v].split(":");
        if (['Droids', 'Cyborgs'].indexOf(s[0]) >= 0) // research result applies to droids and cyborgs
        {
            if (s[1] == "Armour") {
                s[1] = "armourKinetic";
            } else if (s[1] == "Thermal") {
                s[1] = "armourHeat";
            } else if (s[1] == "HitPoints") {
                s[1] = "hitpoints";
            } else if (s[1] == "Power") {
                s[1] = "powerOutput";
            }

            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player].Body) // loop over all bodies
            {
                if (Stats.Body[i].class === s[0]) // if match against hint in ini file, change it
                {
                    Upgrades[player].Body[i][s[1]] += Stats.Body[i][s[1]] * int_value / 100;
                    if(Upgrades[player].Body[i][s[1] + "_percentage"] == undefined)
                    {
                        Upgrades[player].Body[i][s[1] + "_percentage"] = 0;
                    }
                    Upgrades[player].Body[i][s[1] + "_percentage"] += int_value;
                    log_upgrade(Upgrades[player].Body[i], research.grid_id, s[1], int_value);
                }
            }
            {
                //save body class for current research (used "Upgrade" structure, because "Researches" was hashed (fixed) in above code)
                if (Upgrades[player].research_data == undefined) {
                    Upgrades[player].research_data = {};
                }
                if (Upgrades[player].research_data[research.grid_id] == undefined) {
                    Upgrades[player].research_data[research.grid_id] = {};
                }
                Upgrades[player].research_data[research.grid_id].body_res_class = s[0]; //for futher use
                Upgrades[player].research_data[research.grid_id].body_res_changed_field = s[1];
            }
        }
        else if (['ResearchPoints', 'ProductionPoints', 'PowerPoints', 'RepairPoints', 'RearmPoints'].indexOf(s[0]) >= 0) {
            s[0] = setCharAt(s[0], 0, s[0][0].toLowerCase());  // <<<< SHIT
            var int_value = parseFloat(s[1]);
            for (var i in Upgrades[player].Building) {
                if (Stats.Building[i][s[0]] > 0) // only applies if building has this stat already
                {
                    Upgrades[player].Building[i][s[0]] += Stats.Building[i][s[0]] * int_value / 100;
                    log_upgrade(Upgrades[player].Building[i], research.grid_id, s[0], int_value);
                }
            }
        }
        else if (['Wall', 'Structure'].indexOf(s[0]) >= 0) {
            s[1] = setCharAt(s[1], 0, s[1][0].toLowerCase());  // <<<< SHIT
            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player].Building) {
                var hardcoded_type = "";
                if (Stats.Building[i].type == "DEFENSE" || Stats.Building[i].type == "GENERIC") {
                    hardcoded_type = "Wall";
                } else {
                    hardcoded_type = "Structure";
                }
                if(s[1].toLowerCase() == 'hitpoints')
                {
                    s[1] = 'hitpoints';
                }

                if (hardcoded_type === s[0]) // applies to specific building type
                {
                    Upgrades[player].Building[i][s[1]] += Stats.Building[i][s[1]] * int_value / 100;
                    log_upgrade(Upgrades[player].Building[i], research.grid_id, s[1], int_value);
                }
            }
        }
        else if (['ECM', 'Sensor', 'Repair'].indexOf(s[0]) >= 0) {
            s[1] = setCharAt(s[1], 0, s[1][0].toLowerCase());  // <<<< SHIT
            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player][s[0]]) {
                Upgrades[player][s[0]][i][s[1]] += Stats[s[0]][i][s[1]] * int_value / 100;
            }
        }
        else if (['Construct'].indexOf(s[0]) >= 0) {
            s[1] = "constructPoints";
            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player][s[0]]) {
                Upgrades[player][s[0]][i][s[1]] += Stats[s[0]][i][s[1]] * int_value / 100;
                log_upgrade(Upgrades[player][s[0]][i], research.grid_id, s[1], int_value);
            }
        }
        else if (Stats.WeaponClass.indexOf(s[0]) >= 0) // if first field is a weapon class
        {
            s[1] = setCharAt(s[1], 0, s[1][0].toLowerCase());  // <<<< SHIT
            var firePause = s[1].toLowerCase() == 'firepause';
            if (s[1] == "repeatDamage") {
                s[1] = "periodicalDamage";
            }
            var int_value = parseFloat(s[2]);
            {
                //save weapon class for current research (used "Upgrade" structure, because "Researches" was hashed (fixed) in above code)
                if (Upgrades[player].research_data == undefined) {
                    Upgrades[player].research_data = {};
                }
                if (Upgrades[player].research_data[research.grid_id] == undefined) {
                    Upgrades[player].research_data[research.grid_id] = {};
                }
                Upgrades[player].research_data[research.grid_id].weapon_res_class = s[0]; //for futher use
            }
            for (var i in Upgrades[player].Weapon) {
                if (Stats.Weapon[i][s[1]] > 0 && Stats.Weapon[i].weaponSubClass === s[0]) {
                    if (firePause) {
                        if (Upgrades[player].Weapon[i]['reloadTime'] == undefined || Upgrades[player].Weapon[i]['reloadTime'] == 0) {
                            var hint = 'firePause';
                            Upgrades[player].Weapon[i][hint] += Stats.Weapon[i][hint] * int_value / 100;
                        } else {
                            var hint = 'reloadTime';
                            Upgrades[player].Weapon[i][hint] += Stats.Weapon[i][hint] * int_value / 100;
                        }
                        log_upgrade(Upgrades[player].Weapon[i], research.grid_id, 'firePause', int_value);
                    } else {
                        Upgrades[player].Weapon[i][s[1]] += Stats.Weapon[i][s[1]] * int_value / 100;
                        log_upgrade(Upgrades[player].Weapon[i], research.grid_id, s[1], int_value);
                    }
                    
                }
            }
        }
        else {
            console.log("(error) Unrecognized research hint=" + s[0]);
        }
    }
}

function log_upgrade(upgrade_obj, research_id, hint, value) {
    if (upgrade_obj.upgrade_history == undefined) {
        upgrade_obj.upgrade_history = [];
    }
    upgrade_obj.upgrade_history.push({
        research_id: research_id,
        hint: hint,
        value: value,
    });
}

function EnableResearch(research_id) {


}

var Upgrades;
var ResearchedComponents; //time when components are accesible from research
var ResearchTimeState;
var ResearchTime;

function InitResearchObjects() {

    var players_count = 10;
    /* init upgrades array */
    Upgrades = [];
    ResearchedComponents = [];
    ResearchTimeState = [];
    ResearchTime = [];
    for (var i = 0; i < players_count; i++) {
        var PlayerUpgrades = {};
        Upgrades.push(PlayerUpgrades);

        var PlayerResearchedComponents = {};
        ResearchedComponents.push(PlayerResearchedComponents);

        var PlayerResearchTimeState = {};
        ResearchTimeState.push(PlayerResearchTimeState);

        var PlayerResearchTime = {};
        ResearchTime.push(PlayerResearchTime);
    }
}

function LoadAllObjects(all_loaded_callback) {
    
    var loaded_count = 0;
    var load_procedures_count = Objects.length;
    for (var i = 0; i < Objects.length; i++) {
        if (Objects[i].do_not_load != undefined && Objects[i].do_not_load) {
            //object not loadable
            load_procedures_count--;
        } else {
            Objects[i].LoadDataFunction(Objects[i], function () {
                loaded_count++;
                if (loaded_count >= load_procedures_count) {
                    if (all_loaded_callback != undefined) {
                        all_loaded_callback();
                    }
                }
            });
        }
    }
}

var Stats;
var finished_research;

function DoResearchAll(player, do_set_research_time, callback_function) {
    DoResearch(7200, player, callback_function, do_set_research_time);
}

function SetMinResearchTime(player_researcher) {
    /* save minimum research time for a component */
    var res_comps = ResearchedComponents[player_researcher];
    for(var comp_id in res_comps)
    {
        for (var i = 0; i < Objects.length; i++) {
            if (Objects[i].loaded_data_hash != undefined) {
                if (Objects[i].loaded_data_hash[comp_id] != undefined) {
                    Objects[i].loaded_data_hash[comp_id].minResearchTime = res_comps[comp_id].time_seconds;
                }
            }
        }      
    }
}

function DoResearch(time_seconds, player, callback_function, do_set_research_time) {

    /* try load research results from local storage */
    if (localStorage["research_results_player_" + player] != undefined) {
        var res = JSON.parse(localStorage["research_results_player_" + player]);
        if (res.time_seconds == time_seconds) {
            ResearchedComponents[player] = res.ResearchedComponents;
            Upgrades[player] = res.Upgrades;
            ResearchTimeState[player] = res.ResearchTimeState;
            ResearchTime[player] = res.ResearchTime;
            
            if (do_set_research_time) {
                SetMinResearchTime(player);
            }

            if (callback_function != undefined) {
                callback_function();    
            }
            return;
        }
    }

    ResearchedComponents[player] = {};
    Upgrades[player] = {};
    ResearchTimeState[player] = 0;
    ResearchTime[player] = {};

    LoadAllObjects(function () //continue only when all data is loaded on client side
    {
        Stats = {};
        Stats.Weapon = Weapons.loaded_data;
        Stats.Body = Bodies.loaded_data;
        Stats.Building = Structures.loaded_data;
        Stats.Construct = Construction.loaded_data;
        Stats.Repair = Repair.loaded_data;
        Stats.Sensor = Sensor.loaded_data;
        Stats.ECM = ECM.loaded_data;
        Stats.WeaponClass = [];

        var weap_class_tmp = {};
        for (var i = 0; i < Weapons.loaded_data.length; i++) {
            if (Weapons.loaded_data[i].weaponSubClass != undefined) {
                if (weap_class_tmp[Weapons.loaded_data[i].weaponSubClass] == undefined) {
                    Stats.WeaponClass.push(Weapons.loaded_data[i].weaponSubClass);
                }
            }

        }

        /* Init players upgrade data */
        Upgrades[player].Body = jQuery.parseJSON(JSON.stringify(Bodies.loaded_data));
        for (var i = 0; i < Upgrades[player].Body.length; i++) {
            Upgrades[player].Body[i].armour = 0;
        }
        Upgrades[player].Building = jQuery.parseJSON(JSON.stringify(Structures.loaded_data));
        Upgrades[player].Construct = jQuery.parseJSON(JSON.stringify(Construction.loaded_data));
        Upgrades[player].Repair = jQuery.parseJSON(JSON.stringify(Repair.loaded_data));
        Upgrades[player].Sensor = jQuery.parseJSON(JSON.stringify(Sensor.loaded_data));
        Upgrades[player].ECM = jQuery.parseJSON(JSON.stringify(ECM.loaded_data));
        Upgrades[player].Weapon = jQuery.parseJSON(JSON.stringify(Weapons.loaded_data));
        Upgrades[player].upgrades = {};

        var all_research = {};
        for (var i = 0; i < Researches.loaded_data.length; i++) {
            var res_id = Researches.loaded_data[i].grid_id;
            if(all_research[res_id] == undefined)
            {
                all_research[res_id] = {};
                all_research[res_id].ChildRes_Array = [];
            }
            all_research[res_id].Res_Data = Researches.loaded_data[i];
            var requredResearch = Researches.loaded_data[i].requiredResearch;
            all_research[res_id].PreRes_Array = requredResearch == undefined ? [] : Researches.loaded_data[i].requiredResearch.split(',');
            for (var j = 0; j < all_research[res_id].PreRes_Array.length; j++) {
                var pre_res_id = all_research[res_id].PreRes_Array[j];
                if (all_research[pre_res_id] == undefined) {
                    all_research[pre_res_id] = {};
                    all_research[pre_res_id].ChildRes_Array = [];
                }
                if (all_research[pre_res_id].ChildRes_Array == undefined) {
                    all_research[pre_res_id].ChildRes_Array = [];
                };
                all_research[pre_res_id].ChildRes_Array.push(res_id);
            }

        }


        var active_research = {};
        finished_research = {};
        var lab_power = parseInt(Structures.loaded_data_hash["A0ResearchFacility"].researchPoints);
        var lab_module_power = parseInt(Structures.loaded_data_hash["A0ResearchModule1"].researchPoints);

        var is_module_ready = false;
        var is_module_research_ready = false;
        var current_time = 0; //seconds
        
        var completeResearch = function (research_id, player_number) {

            if (research_id == 'R-Struc-Research-Module') {
                is_module_research_ready = true;
            }

            //apply research results
            var res_row = all_research[research_id];
            eventResearched(res_row.Res_Data, player_number);

            ResearchTime[player_number][research_id] = current_time;

            if (res_row.Res_Data.resultComponents != undefined)
            {
                var result_components = res_row.Res_Data.resultComponents.split(',');
                for(var e=0; e<result_components.length; e++)
                {
                    ResearchedComponents[player_number][result_components[e]] = {};
                    ResearchedComponents[player_number][result_components[e]].time_seconds = current_time;
                    ResearchedComponents[player_number][result_components[e]].research_id = research_id;
                } 
            }

            if (res_row.Res_Data.resultStructures != undefined) {
                var resultStructures = res_row.Res_Data.resultStructures.split(',');
                for (var e = 0; e < resultStructures.length; e++) {
                    ResearchedComponents[player_number][resultStructures[e]] = {};
                    ResearchedComponents[player_number][resultStructures[e]].time_seconds = current_time;
                    ResearchedComponents[player_number][resultStructures[e]].research_id = research_id;
                }
            }
            ResearchedComponents[player_number][research_id] = { time_seconds: current_time, research_id: research_id };

            //remove from active research
            delete active_research[research_id];

            //add to finished research
            finished_research[research_id] = res_row;
            finished_research[research_id].finish_time = current_time; //seconds

            /* see what we can start to research */
            for (var i = 0; i < res_row.ChildRes_Array.length; i++)
            {
                //enum child research
                var child_res_id = res_row.ChildRes_Array[i];
                var child_res_row = all_research[child_res_id];
                if (active_research[child_res_id] == undefined) {
                    var all_pre_res_finished = true;
                    for (var j = 0; j < child_res_row.PreRes_Array.length; j++)
                    {
                        //enum pre-res for child research
                        var pre_res_id = child_res_row.PreRes_Array[j];
                        if (finished_research[pre_res_id] == undefined) {
                            all_pre_res_finished = false;
                            break;
                        }
                    }
                    if (all_pre_res_finished && finished_research[child_res_id] == undefined) {
                        /* start new research */
                        active_research[child_res_id] = all_research[child_res_id];
                        active_research[child_res_id].progress = 0;
                    }
                }
            }

            /* re-evaluate lab power in case if it was changed */
            lab_power = parseInt(Upgrades[player].Building[Structures.loaded_data_hash["A0ResearchFacility"].index_of_datarow].researchPoints);
        }

        /* start game research */
        for (var count = 0; count < numCleanTech; count++) {
            completeResearch(techlist[count], player);
        }

        /* see what research are enabled from start */
        for (var res_id in all_research) {
            if (active_research[res_id] == undefined && finished_research[res_id] == undefined) {
                if (all_research[res_id].PreRes_Array.length == 0) {
                    active_research[res_id] = all_research[res_id];
                    active_research[res_id].progress = 0;
                }
            }
        }

        var time_to_build_up_labs = 30; //seconds
        var build_up_module_timeout = 30; //seconds
        var module_progress = 0; //seconds

        current_time += time_to_build_up_labs;
        /* main research loop (1 iteration = 1 second) */
        while (true) {
            var lab_power_current = lab_power;
            if (is_module_ready) {
                lab_power_current = lab_power + lab_module_power;
            } else {
                if (is_module_research_ready) {
                    if (module_progress >= build_up_module_timeout) {
                        is_module_ready = true;
                    } else {
                        module_progress++;
                    }
                }
            }

            //get finished research
            var finished_res_tmp = [];
            for (var res_id in active_research) {
                if (active_research[res_id].progress >= active_research[res_id].Res_Data.researchPoints) {
                    finished_res_tmp.push(res_id);
                }
            }

            //evaluate results of finished research on previous step
            for (var i = 0; i < finished_res_tmp.length; i++) {
                completeResearch(finished_res_tmp[i], player);
            }

            //add progress to active research
            
            for (var res_id in active_research) {
                active_research[res_id].progress += lab_power_current;
            }

            current_time++;

            if (current_time >= time_seconds) {
                break;  //end main loop TIME LEFT
            }

            var has_active_research = false;
            for (var res in active_research) {
                has_active_research = true;
                break;
            }
            if (!has_active_research) {
                break; //end main loop ALL RESEARCHED
            }
        }

        ResearchTimeState[player] = time_seconds;

        /* save research results to local storage */
        var save_results = {};
        save_results.time_seconds = time_seconds;
        save_results.ResearchedComponents = ResearchedComponents[player];
        save_results.Upgrades = Upgrades[player];
        save_results.ResearchTimeState = ResearchTimeState[player];
        save_results.ResearchTime = ResearchTime[player];
        localStorage["research_results_player_" + player] = JSON.stringify(save_results);

        if (do_set_research_time) {
            SetMinResearchTime(player);
        }

        if (callback_function != null) {
            callback_function(finished_research);
        }
        //
    });
}


/*
Research Groups

- Production upgrades + Construction Upgrades
- Power Upgrades
- Repair Turrets + Repair Upgrades + Repair Buildings
- VTOL Rearming Structures + VTOL Rearming upgrades
- Research upgrades
- Base Structures Line
    --Sub_line - Armor of base structures
- Bodies
    -- Tank Armor/Thermal Armor upgrades
    -- Engine Upgrades
    -- Cyborg Armor/Thermal Armor upgrades
- Propulsion
- Hardcrete upgrades
- Sensors/Sensor towers
- Weapon lines
    --Weapon Damage/Rof upgrades
    --Defenses linked from weapon lines
 - Other upgrades


'ResearchPoints', 'ProductionPoints', 'PowerPoints', 'RepairPoints', 'RearmPoints'].indexOf(s[0]) >= 0) {
*/


function CreateResearchLines() {
    var res_lines = [];
    var res_sublines = [];

    /* Production upgrades + Construction Upgrades */
    {
        var line = {};
        line.height_em = 0.7;
        line.line_color = "darkblue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("ProductionPoints") >= 0 || research.results_string.indexOf("ConstructorPoints") >= 0;
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Research upgrades */
    {
        var line = {};
        line.height_em = 1.1;
        line.line_color = "blue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("ResearchPoints") >= 0;
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Base Structures Line */
    var struc_line = {};
    struc_line.child_lines = [];
    {
        var line = struc_line;
        line.height_em = 1;
        line.line_color = "darkorange";
        line.filterResearch_func = function (research) {
            if (research.resultStructures != undefined) {
                var struc_list = research.resultStructures.split(',');
                for (var is in struc_list) {
                    var struc = Structures.loaded_data_hash[struc_list[is]];
                    if (struc.type != "DEFENSE" && !(struc.type == "GENERIC" && struc.strength=="HARD")) {
                        return true;
                    }
                }
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Subline - Armor of base structures */
    {
        var line = {};
        line.height_em = 0.7;
        line.line_color = "gray";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.name.indexOf("Base Structure Materials") >= 0;
            }
            return false;
        }
        struc_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* Repair Turrets + Repair Upgrades + Repair Buildings */
    {
        var line = {};
        line.height_em = 0.7;
        line.line_color = "blue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("RepairPoints") >= 0;
            }
            if (research.resultComponents != undefined) {
                var comp_list = research.resultComponents.split(',');
                for (var ic in comp_list) {
                    var comp_id = comp_list[ic];
                    if (Repair.loaded_data_hash[comp_id] != undefined) {
                        return true;
                    }
                }
            }
            if (research.resultStructures != undefined) {
                var struc_list = research.resultStructures.split(',');
                for (var is in struc_list) {
                    var struc = Structures.loaded_data_hash[struc_list[is]];
                    if (struc.repairPoints != undefined && struc.rearmPoints == undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        struc_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* VTOL Rearming Upgrades */
    {
        var line = {};
        line.height_em = 0.7;
        line.line_color = "blue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("RearmPoints") >= 0;
            }
            if (research.resultStructures != undefined) {
                var struc_list = research.resultStructures.split(',');
                for (var is in struc_list) {
                    var struc = Structures.loaded_data_hash[struc_list[is]];
                    if (struc.rearmPoints != undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        struc_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* Bodies */
    var body_line = {};
    body_line.child_lines = [];
    {
        var line = body_line;
        line.height_em = 1;
        line.line_color = "green";
        line.filterResearch_func = function (research) {
            if (research.resultComponents != undefined) {
                var comp_list = research.resultComponents.split(',');
                for (var ic in comp_list) {
                    var comp_id = comp_list[ic];
                    if (Bodies.loaded_data_hash[comp_id] != undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Subline - Tank Armor/Thermal Armor upgrades */
    {
        var line = {};
        line.height_em = 0.75;
        line.line_color = "green";
        line.filterResearch_func = function (research) {
            return is_tank_body_upgrade(research);
        }
        body_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* Subline - Cyborg Armor/Thermal Armor upgrades */
    {
        var line = {};
        line.height_em = 0.75;
        line.line_color = "green";
        line.filterResearch_func = function (research) {
            return is_cyborg_body_upgrade(research);
        }
        body_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* Subline - Engine Upgrades */
    {
        var line = {};
        line.height_em = 0.75;
        line.line_color = "green";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf(":Power:") >= 0;
            }
            return false;
        }
        body_line.child_lines.push(line);
        res_sublines.push(line);
    }

    /* Propulsion */
    {
        var line = {};
        line.height_em = 1;
        line.line_color = "blue";
        line.filterResearch_func = function (research) {
            if (research.resultComponents != undefined) {
                var comp_list = research.resultComponents.split(',');
                for (var ic in comp_list) {
                    var comp_id = comp_list[ic];
                    if (Propulsion.loaded_data_hash[comp_id] != undefined) {
                        return true;
                    }
                }
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Hardcrete upgrades */
    {
        var line = {};
        line.height_em = 0.75;
        line.line_color = "green";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("Wall:Armour:") >= 0 || research.results_string.indexOf("Wall:HitPoints:") >= 0;
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Sensors, Sensor Towers */
    {
        var line = {};
        line.height_em = 1;
        line.line_color = "blue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                if (research.results_string.indexOf("Sensor:Range") >= 0)
                {
                    return true;
                }
            }
            if (research.resultComponents != undefined)
            {
                var comp_list = research.resultComponents.split(',');
                for (var ic in comp_list) {
                    var comp_id = comp_list[ic];
                    if (Sensor.loaded_data_hash[comp_id] != undefined) {
                        return true;
                    }
                }
            }
            if (research.resultStructures != undefined) {
                var struc_list = research.resultStructures.split(',');
                for (var ic in struc_list) {
                    var struc = Structures.loaded_data_hash[struc_list[ic]];
                    if (struc != undefined) {
                        if (struc.type == "DEFENSE" && struc.weapons == undefined)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Power Upgrades */
    {
        var line = {};
        line.height_em = 0.7;
        line.line_color = "lightblue";
        line.filterResearch_func = function (research) {
            if (research.results.length > 0) {
                return research.results_string.indexOf("PowerPoints") >= 0;
            }
            return false;
        }
        res_lines.push(line);
    }

    /* Weapons, Weapon upgrades */
    {
        var weap_res_classes_array = [];
        /* Group weapons into lines */
        {
            var weap_res_classes = {};
            for (var i in Weapons.loaded_data) {
                var weapon = Weapons.loaded_data[i];
                if (!can_research(weapon.grid_id)) {
                    continue;
                }
                var res_class = weapon.weaponSubClass;
                if (res_class == undefined) {
                    continue;
                }

                if (weap_res_classes[res_class] == undefined) {
                    weap_res_classes[res_class] = {};
                    weap_res_classes[res_class].weapons_ids = {};
                    weap_res_classes[res_class].weapons_ids[weapon.grid_id] = 1;
                } else {
                    weap_res_classes[res_class].weapons_ids[weapon.grid_id] = 1;
                }
            }
            
            for (var res_class in weap_res_classes) {
                weap_res_classes_array.push({
                    res_classes: [res_class],
                    weapons_ids: weap_res_classes[res_class].weapons_ids,
                });
            }
        }
        /* join small lines + remove emplty lines */
        {
            var new_weap_res_classes_array = [];
            var small_weap_class = {};
            small_weap_class.res_classes = [];
            small_weap_class.weapons_ids = {};
            for (var i in weap_res_classes_array) {
                var weap_cnt = 0;
                for (var weap_id in weap_res_classes_array[i].weapons_ids) {
                    weap_cnt++;
                }
                if (weap_cnt < 2) {
                    //push into one "small line"..
                    for (var weap_id in weap_res_classes_array[i].weapons_ids) {
                        small_weap_class.weapons_ids[weap_id] = 1;
                    }
                    small_weap_class.res_classes = small_weap_class.res_classes.concat(weap_res_classes_array[i].res_classes);
                } else {
                    new_weap_res_classes_array.push(weap_res_classes_array[i]);
                }
            }
            if (small_weap_class.res_classes.length > 0) {
                new_weap_res_classes_array.push(small_weap_class);
            }
            weap_res_classes_array = new_weap_res_classes_array;
        }

        /* Fill up research lines */
        {
            for (var i in weap_res_classes_array) {
                var line = {};
                line.height_em = 1;
                line.line_color = "darkred";
                line.child_lines = [];
                line.weapons_ids = weap_res_classes_array[i].weapons_ids;
                line.filterResearch_func = function (research) {
                    if (research.resultComponents != undefined) {
                        var comp_list = research.resultComponents.split(',');
                        for (var ic in comp_list) {
                            var comp_id = comp_list[ic];
                            return Weapons.loaded_data_hash[comp_id] != undefined && line.weapons_ids[comp_id] != undefined;
                        }
                    }
                    return false;
                }
                line.subItems_filterResearch_func = function (research) {
                    if (this.filterResearch_func(research))
                    {
                        return false;//make sure we do not take wrong research as sub-item
                    }
                    var parent_res_included_in_line = false;
                    if (research.requiredResearch != undefined)
                    {
                        var res_list = research.requiredResearch.split(',');
                        for (var ir in res_list)
                        {
                            var parent_res = Researches.loaded_data_hash[res_list[ir]];
                            if (parent_res != undefined)
                            {
                                if (this.filterResearch_func(parent_res))
                                {
                                    parent_res_included_in_line = true;
                                    break;
                                }
                                if (this.child_lines != undefined)
                                {
                                    for (var icl in this.child_lines)
                                    {
                                        if (this.child_lines[icl].filterResearch_func(parent_res)) {
                                            parent_res_included_in_line = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                    }
                    var do_we_have_defense_as_result = false;
                    if (research.resultStructures != undefined) {
                        var struc_list = research.resultStructures.split(',');
                        for (var is in struc_list) {
                            var struc = Structures.loaded_data_hash[struc_list[is]];
                            if (struc != undefined)
                            {
                                if (struc.type == "DEFENSE" || struc.type == "GENERIC")
                                {
                                    do_we_have_defense_as_result = true;
                                    break;
                                }
                            }
                        }
                    }
                    return parent_res_included_in_line && do_we_have_defense_as_result;
                }
                res_lines.push(line);

                /* Create Upgrade line for this weapon line */
                var upgr_line = {};
                upgr_line.height_em = 0.75;
                upgr_line.line_color = "darkpink";
                upgr_line.weapons_ids = weap_res_classes_array[i].weapons_ids;
                line.child_lines.push(upgr_line);
                upgr_line.weap_subclass = weap_res_classes_array[i].res_classes;
                upgr_line.filterResearch_func = function (research) {
                    var res_id = research.grid_id;
                    if (Upgrades[player_all_researched].research_data != undefined)
                        if (Upgrades[player_all_researched].research_data[res_id] != undefined)
                            if (Upgrades[player_all_researched].research_data[res_id].weapon_res_class == this.weap_subclass) {
                                return true;
                            }
                    return false;
                };
                res_sublines.push(upgr_line);
            }
        }
    }

    /* Other research (not included in lines above) */
    var other_line = {};
    {
        var line = other_line;
        line.height_em = 1;
        line.line_color = "orange";
        line.filterResearch_func = function (research) {
            return false;
        };
        res_lines.push(line);
    }

    var all_lines = res_lines.concat(res_sublines);
    for (var iline in all_lines)
    {
        var line = all_lines[iline];
        line.items = {};
        line.sub_items = {};
    }

    /* Fill research lines */
    for (var ires in Researches.loaded_data) {
        var research = Researches.loaded_data[ires];
        var res_id = research.grid_id;
        var pushed = false;
        if (!can_research(res_id)) {
            continue;
        }
        for (var iline in all_lines) {
            var line = all_lines[iline];
            if (line.filterResearch_func(research) && !pushed) {
                line.items[res_id] = research;
                pushed = true;
            }
            if (line.subItems_filterResearch_func != undefined && !pushed) {
                if (line.subItems_filterResearch_func(research))
                {
                    line.sub_items[res_id] = research;
                    pushed = true;
                }
            }
        }
        if (!pushed) {
            other_line.items[res_id] = research;
        }
    }

    /* Sort research lines by minimum time to get first item in line */
    {
        for (var i in res_lines) {
            var line = res_lines[i];
            line.minResearchTime = 100 * 100;
            for (var res_id in line.items) {
                var res_time = ResearchTime[player_all_researched][res_id];
                line.minResearchTime = Math.min(line.minResearchTime, res_time);
            }
        }
        res_lines.sort(function (elm1, elm2) {
            return elm1.minResearchTime - elm2.minResearchTime;
        });
    }
    return res_lines;
}

var SvgItem = function () { };
SvgItem.prototype = (function () {
    var me = {};
    me.z_order = 0;
    me.x = 0;
    me.y = 0;
    me.drawFunction = null;
    return me;
})();

var ResSvgItem = function () { };
ResSvgItem.prototype = (function () {
    var me = {};
    me.rect_item = null;
    me.icon_item = null;
    me.text_item = null;
    me.research_stat_obj = null;
    me.parent_res = [];
    me.child_res = [];
    me.drawFunction = null;
    me.x = 0;
    me.y = 0;
    me.line = null;
    me.svg_items = [];
    me.res_time = 0;
    me.z_order = 0;
    return me;
})();

function DrawResearchTree(container_id, sec_per_pixel)
{
    var x_size;
    var icon_height = 48;
    var icon_width = 52;
    var svg_elems = []; //array of all draw items
    var x_zero_time = 100;
    var y_offset_top = 35;
    var y_offset_bottom = 50;
    var line_space = 2;
    var canvas;
    /* Calculate maximum research time */
    {
        var max_res_time = 0;
        for (var i in Researches.loaded_data) {
            var res_time = ResearchTime[player_all_researched][Researches.loaded_data[i].grid_id]
            if (res_time != undefined) {
                max_res_time = Math.max(res_time, max_res_time);
            }
        }
        x_size = max_res_time * sec_per_pixel + 200;
    }

    /* Distance between two vertical lines*/
    var vertical_lines_period_thin = 60; //pixels
    var vertical_lines_period_thick = 600; //pixels
    {
        if (sec_per_pixel > 0.5 && sec_per_pixel < 0.9) {
            vertical_lines_period_thick = 300;
        } else if (sec_per_pixel <= 0.5) {
            vertical_lines_period_thick = 180;
        }
    }

    var draw_research_icon = function (res_svg_item, x, y, scale)
    {
        var research = res_svg_item.research_stat_obj;
        var width = icon_width * scale;
        var height = icon_height * scale;
        var icon_src = GetResearchIcon_src(research.grid_id);
        var elm_icon;
        var res_text = "";
        var res_text_items = research.name.split(' ');
        var text_lines = 1;
        var line = res_svg_item.line;
        if (res_text_items.length == 1)
        {
            res_text = res_text_items[0];
        } else
        {
            for (var ii = 0; ii < res_text_items.length; ii++)
            {
                res_text += res_text_items[ii].substring(0, 7);
                if ((ii+1) % 2 == 0 && ii>0)
                {
                    res_text += "\n";
                    text_lines++;
                } else
                {
                    res_text += " ";
                }
            }
        }
        var text_y_offset = (text_lines - 1) * 8 + 2;
        res_svg_item.text_height = text_lines * 8;
        res_svg_item.res_text = res_text;
        if (icon_src != null)
        {
            /* DRAW IMAGE */
            var img = new Image();
            img.src = icon_src;
            img.res_svg_item = res_svg_item;
            img.scale = scale;
            img.onload = function () {
                var res_svg_item = this.res_svg_item;
                var img = new fabric.Image(this, {
                    top: y + 1,
                    left: x + 1,
                    selectable: true,
                    hoverCursor: "pointer",
                    scaleY: this.scale,
                    scaleX: this.scale,
                });
                canvas.add(img);
                res_svg_item.icon_item = img
                img.res_svg_item = res_svg_item;

                var txt = new fabric.Text(res_svg_item.res_text, {
                    left: x + img.width,
                    top: y + 1,
                    fontSize: 11,
                    textAlign: 'center',
                });
                txt.res_svg_item = res_svg_item;
                res_svg_item.text_item = txt;
                canvas.add(txt);

                res_svg_item.svg_items = res_svg_item.svg_items.concat([res_svg_item.icon_item, res_svg_item.text_item]);
                //var line = res_svg_item.line;
                //line.additional_height = Math.max(line.additional_height, txt.text_height + 2);
            };
            img.onerror = function () {
                //image loading error - draw empty rect
                this.res_svg_item.icon_item = new fabric.Rect({
                    left: x + 1,
                    strokeWidth: 2,
                    stroke: this.res_svg_item.line.line_color,
                    top: y + 1,
                    height: height - 1,
                    width: width - 1,
                    fill: this.res_svg_item.line.line_color,
                    selectable: true,
                    hoverCursor: "pointer",
                })
                canvas.add(res_svg_item.icon_item);
                this.res_svg_item.icon_item.res_svg_item = this.res_svg_item;

                var txt = new fabric.Text(res_svg_item.res_text, {
                    left: x + 3,
                    top: y + 3,
                    fontSize: 11,
                    textAlign: 'center',
                    hoverCursor: "pointer",
                    selectable: true,
                });
                txt.res_svg_item = res_svg_item;
                res_svg_item.text_item = txt;
                canvas.add(txt);

                res_svg_item.svg_items = res_svg_item.svg_items.concat([res_svg_item.icon_item, res_svg_item.text_item]);
            }

        } else
        {
            /* DRAW RECT */
            res_svg_item.icon_item = new fabric.Rect({
                left: x + 1,
                stroke: res_svg_item.line.line_color,
                strokeWidth: 2,
                top: y + 1,
                height: height - 1,
                width: width - 1,
                fill: "lightgray",
                selectable: true,
                hoverCursor: "pointer",
            })
            canvas.add(res_svg_item.icon_item);
            res_svg_item.icon_item.res_svg_item = res_svg_item;

            var txt = new fabric.Text(res_text, {
                left: x + 3,
                top: y + 3,
                fontSize: 11,
                textAlign: 'center',
                hoverCursor: "pointer",
                selectable: true,
            });
            txt.res_svg_item = res_svg_item;
            res_svg_item.text_item = txt;
            canvas.add(txt);

            res_svg_item.svg_items = res_svg_item.svg_items.concat([res_svg_item.icon_item, res_svg_item.text_item]);
        }
    }

    var drawn_lines = [];

    /* ***** Draw research*/
    {
        var func_drawIconBox = function (research, res_id, __x_offset, __y_offset)
        {
            var res_svg_item = new ResSvgItem();
            res_svg_item.svg_items = [];
            res_svg_item.research_stat_obj = research;
            res_svg_item.line = line;
            res_svg_item.res_time = ResearchTime[player_all_researched][res_id];
            res_svg_item.x = x_zero_time + res_svg_item.res_time * sec_per_pixel + __x_offset;
            res_svg_item.y = __y_offset;
            res_svg_item.z_order = 100;
            res_svg_item.drawFunction = function () {
                draw_research_icon(this, this.x, this.y, this.line.height_em);
            }
            svg_elems.push(res_svg_item);
            res_svg_items_hash[res_id] = res_svg_item;
        }

        var func_drawline = function (line)
        {
            var scaled_icon_height = icon_height * line.height_em;
            /* Draw line items */
            for (var res_id in line.items) {
                var research = line.items[res_id];
                func_drawIconBox(research, res_id, 0, 0);
            }
            /* Draw line sub items */
            if (line.sub_items != undefined) {
                var sub_item_offset = scaled_icon_height * 0.65;
                line.additional_height = Math.max(line.additional_height, sub_item_offset)
                for (var res_id in line.sub_items) {
                    var research = line.sub_items[res_id];
                    func_drawIconBox(research, res_id, 0, sub_item_offset);
                }
            }
            drawn_lines.push(line);
        }
        var res_svg_items_hash = {};
        var res_lines = CreateResearchLines();

        for (var i in res_lines) {
            var line = res_lines[i];
            line.additional_height = 0;
            func_drawline(line);
            if (line.child_lines != undefined)
            {
                for (var icl in line.child_lines)
                {
                    line.child_lines[icl].additional_height = 0;
                    func_drawline(line.child_lines[icl])
                }
            }
            
        }
    }

    /* Fill up parent_res and child_res*/
    {
        for (var res_id in res_svg_items_hash) {
            res_svg_items_hash[res_id].child_res = [];
            res_svg_items_hash[res_id].parent_res = [];
            res_svg_items_hash[res_id].child_lines = [];
            res_svg_items_hash[res_id].parent_lines = [];
        }
        {
            for (var i in Researches.loaded_data) {
                var res_id = Researches.loaded_data[i].grid_id;
                var research = Researches.loaded_data_hash[res_id];
                var res_svg_item = res_svg_items_hash[res_id];
                if (res_svg_item == undefined) {
                    continue;
                }
                if (research.requiredResearch != undefined) {
                    var pre_res_array = research.requiredResearch.split(',');
                    for (var pi in pre_res_array) {
                        var pre_res_id = pre_res_array[pi];
                        var pre_research = Researches.loaded_data_hash[pre_res_id];
                        var pre_res_svg_item = res_svg_items_hash[pre_res_id];
                        if (pre_res_svg_item == undefined) {
                            continue;
                        }
                        pre_res_svg_item.child_res.push(res_svg_item);
                        res_svg_item.parent_res.push(pre_res_svg_item);
                    }
                }
            }
        }
    }

    
    
    var y_size = 2000;//res_lines[res_lines.length - 1].pos_y + res_lines[res_lines.length - 1].height_expected + y_offset_bottom + line_space;
    var x_size = max_res_time * sec_per_pixel + 200;

    /* Draw paper */
    var paper_elem_id = container_id + "_timeTableSvgCanva";
    {
        $('#' + container_id).html('<canvas height="' + y_size + '" width="' + x_size + '" id="' + paper_elem_id + '"></canvas>');
        
        canvas = new fabric.Canvas(paper_elem_id, { renderOnAddRemove: false });//StaticCanvas
        // !!! WARNING: renderOnAddRemove: false  - greatly imptoves perfomance!!!
        //canvas.selection = false; // disable group selection
        canvas.on("after:render", function () { canvas.calcOffset(); }); //this line fixes wrong mouse offset (i hate that fabric.js already!)
        fabric.Object.prototype.selectable = false;

        /* bugfix for fabric.js */
        fabric.Line.prototype._setWidthHeight = function (options) {
            options || (options = {});
            this.set('width', Math.abs(this.x2 - this.x1) || 1);
            this.set('height', Math.abs(this.y2 - this.y1) || 1);

            var left = 'left' in options ? options.left : (Math.min(this.x1, this.x2) + this.width / 2),
                top = 'top' in options ? options.top : (Math.min(this.y1, this.y2) + this.height / 2);

            this.setPositionByOrigin(new fabric.Point(left, top), 'center', 'center');
        };

    }

    /* Sort svg items by z_order */
    svg_elems.sort(function (elm1, elm2) {
        return elm1.z_order - elm2.z_order;
    });

    /* Draw svg items in given order */
    {
        for (var i in svg_elems) {
            svg_item = svg_elems[i];
            svg_item.drawFunction();
        }
    }

    /* Part2 - called after all images are loaded */
    var draw_research_tree_part2 = function () {
        console.log('draw_research_tree_part2');

        /* SET Y COORD */
        var next_line_offset = 0;
        var line_height;
        for (var iline in drawn_lines) {
            var line = drawn_lines[iline];
            line_height = 0;
            for (var res_id in line.items) {
                svg_res_item = res_svg_items_hash[res_id];
                for (var i in svg_res_item.svg_items)
                {
                    var svg_item = svg_res_item.svg_items[i];
                    line_height = Math.max(svg_item.top + svg_item.height, line_height);
                    svg_item.setTop(y_offset_top + svg_item.top + next_line_offset);
                    svg_item.setCoords();
                }
            }
            for (var res_id in line.sub_items) {
                svg_res_item = res_svg_items_hash[res_id];
                for (var i in svg_res_item.svg_items) {
                    var svg_item = svg_res_item.svg_items[i];
                    line_height = Math.max(svg_item.top + svg_item.height, line_height);
                    svg_item.setTop(y_offset_top + svg_item.top + next_line_offset);
                    svg_item.setCoords();
                }
            }
            next_line_offset += line_height + line_space;
        }
        y_size = next_line_offset + line_height + 100;
        canvas.setHeight(y_size);
        canvas.calcOffset();

        /* Draw TIMELINES*/
        {
            var top_line_y = y_offset_top - 10;
            var bottom_line_y = y_size - y_offset_bottom + 10;
            /* Top Line */
            {
                var x =  10;
                var y = top_line_y;
                var txt = new fabric.Text("Timeline", { left: x, top: y - 18, fontSize: 12 });
                canvas.add(txt);
                var line = new fabric.Line([x, y, x_size, y], {
                    stroke: 'black',
                    selectable: false,
                });
                canvas.insertAt(line, 0);
            }

            /* Bottom Line */
            {
                var x = 10;
                var y = bottom_line_y;
                var txt = new fabric.Text("Timeline", { left: x, top: y + 2, fontSize: 12 });
                canvas.add(txt);
                var line = new fabric.Line([x, y, x_size - 10, y], {
                    stroke: 'black',
                    selectable: false,
                });
                canvas.add(line);
            }

            for (var i = 0; i <= x_size; i = i + vertical_lines_period_thin) {
                var x = i + x_zero_time;
                var time = Math.floor(i / sec_per_pixel); //time in seconds
                var y0 = top_line_y - 7;
                var y1 = bottom_line_y + 7;
                var x = i + x_zero_time;
                var y = y0;
                if (i % vertical_lines_period_thick == 0) {
                    /* bold line */
                    var line = new fabric.Line([x, y, x, y1], {
                        stroke: 'black',
                        strokeWidth: 2,
                        selectable: false,
                    });
                    canvas.insertAt(line, 0);

                    var txt_top = new fabric.Text(time.tohhMMSS(), { left: x, top: top_line_y - 10, fontSize: 12, fontWeight: 'bold' });
                    txt_top.setLeft(this.x - txt_top.getWidth() / 2 + 1);
                    txt_top.setTop(top_line_y - 10 - txt_top.getHeight() / 2);
                    canvas.insertAt(txt_top, 0);

                    var txt_bottom = new fabric.Text(time.tohhMMSS(), { left: x, top: bottom_line_y + 10, fontSize: 12, fontWeight: 'bold' });
                    txt_bottom.setLeft(x - txt_bottom.getWidth() / 2 + 1);
                    txt_bottom.setTop(bottom_line_y + 10 - txt_bottom.getHeight() / 2);
                    canvas.insertAt(txt_bottom, 0);
                } else {
                    /* Thin line */
                    var line = new fabric.Line([x, y, x, y1], {
                        stroke: 'black',
                        selectable: false,
                    });
                    line.setOpacity(0.7);
                    canvas.insertAt(line, 0);

                    var txt_top = new fabric.Text(time.tohhMMSS(), { left: x, top: top_line_y - 10, fontSize: 12 });
                    txt_top.setLeft(x - txt_top.getWidth() / 2);
                    txt_top.setTop(top_line_y - 10 - txt_top.getHeight() / 2);
                    canvas.insertAt(txt_top, 0);

                    var txt_bottom = new fabric.Text(time.tohhMMSS(), { left: x, top: bottom_line_y + 10, fontSize: 12 });
                    txt_bottom.setLeft(x - txt_bottom.getWidth() / 2);
                    txt_bottom.setTop(bottom_line_y + 10 - txt_bottom.getHeight() / 2);
                    canvas.insertAt(txt_bottom, 0);
                }
            }
        }

        /* Draw CONNECTION Lines */
        for (var res_id in res_svg_items_hash) {
            var svg_res_item = res_svg_items_hash[res_id];
            for (var u in svg_res_item.child_res) {

                parent =  svg_res_item;
                child = svg_res_item.child_res[u];

                var conn_number;
                if (child.parent_res.length == 1)
                {
                    conn_number = 0; 
                } else
                {
                    conn_number = child.parent_lines.length - child.parent_res.length / 2;
                }

                var obj1 = {
                    x: parent.icon_item.oCoords.tl.x,
                    y: parent.icon_item.oCoords.tl.y,
                    width: parent.icon_item.width,
                    height: parent.icon_item.height,
                };

                var obj2 = {
                    x: child.icon_item.oCoords.tl.x,
                    y: child.icon_item.oCoords.tl.y,
                    width: child.icon_item.width,
                    height: child.icon_item.height,
                };
                var path = connectionPath(obj1, obj2, conn_number);
                var line = new fabric.Path(path, {
                    fill: false,
                    stroke: parent.line.line_color,
                    originX: 'center', //these two lines are fix bug... do not know how it works. but with these 2 lines it works ok
                    originY: 'center',
                    selectable: false,
                });

                //var line = new fabric.Line([obj1.x, obj1.y, obj2.x, obj2.y],
                //{
                //    //top: Math.min(obj1.y, obj2.y),
                //    //left: obj1.x,
                //    stroke: 'green',
                //    selectable: false,
                //});
                canvas.insertAt(line, 0); //make sure connection line will be inserted under research rectangles (icons)

                parent.child_lines.push(line);
                child.parent_lines.push(line);
                line.parent = parent;
                line.child = child;
            }
        }

        /* DRAW HOVERING EFFECTS */
        {
            //following code allows to use object:over and object:out
            canvas.findTarget = (function (originalFn) {
                return function () {
                    var target = originalFn.apply(this, arguments);
                    if (target) {
                        if (this._hoveredTarget !== target) {
                            if (this._hoveredTarget) {
                                canvas.fire('object:out', { target: this._hoveredTarget });
                            }
                            canvas.fire('object:over', { target: target });
                            this._hoveredTarget = target;
                        }
                    }
                    else if (this._hoveredTarget) {
                        canvas.fire('object:out', { target: this._hoveredTarget });
                        this._hoveredTarget = null;
                    }
                    return target;
                };
            })(canvas.findTarget);

            var highlight_rect_show = function (img_item)
            {
                img_item.rect_border = new fabric.Rect(
                    {
                        left: img_item.oCoords.tl.x - 1,
                        top: img_item.oCoords.tl.y - 1,
                        height: img_item.height + 1,
                        width: img_item.width + 1,
                        stroke: 'green',
                        strokeWidth: 3,
                        fill: false,
                    });
                canvas.add(img_item.rect_border);
            }
            var highlight_rect_hide = function (img_item) {
                canvas.remove(img_item.rect_border);
                img_item.rect_border = null;
            }
            var hovered_items = [];
            var hover_event = null;
            var hover_on = function (res_svg_item)
            {
                /* Highlight child lines/icons */
                if (res_svg_item.child_lines) {
                    for (var i in res_svg_item.child_lines) {
                        var line = res_svg_item.child_lines[i];
                        line.set('strokeWidth', 3);
                        if (line.child.icon_item.type == "image") {
                            highlight_rect_show(line.child.icon_item);
                        } else {
                            line.child.icon_item.set("strokeWidth", 3);
                        }
                        //line.child.icon_item.bringToFront();  - very slow
                        //line.child.text_item.bringToFront();
                    }
                }

                /* Highlight parent lines/icons */
                if (res_svg_item.parent_lines) {
                    for (var i in res_svg_item.parent_lines) {
                        var line = res_svg_item.parent_lines[i];
                        line.set('strokeWidth', 3);
                        if (line.child.icon_item.type == "image") {
                            highlight_rect_show(line.parent.icon_item);
                        } else {
                            line.child.icon_item.set("strokeWidth", 3);
                        }
                        //line.child.icon_item.bringToFront();  - very slow
                        //line.child.text_item.bringToFront();
                    }
                }

                /* Highlight current research icon */
                if (res_svg_item.icon_item.type == "image") {
                    var x = res_svg_item.icon_item.oCoords.tl.x - 1, y = res_svg_item.icon_item.oCoords.tl.y - 1;
                    res_svg_item.icon_item.filters.push(
                       new fabric.Image.filters.Brightness({ brightness: 75 }));
                    res_svg_item.icon_item.applyFilters(function () { canvas.renderAll(); });
                } else {
                    res_svg_item.icon_item.set("strokeWidth", 3);
                    canvas.renderAll();
                }
                //res_svg_item.icon_item.bringToFront(); - very slow
                //res_svg_item.text_item.bringToFront();

            }
            var hover_off = function (res_svg_item) {
                //Hide highlight for child lines/icons 
                if (res_svg_item.child_lines) {
                    for (var i in res_svg_item.child_lines) {
                        var line = res_svg_item.child_lines[i];
                        line.set('strokeWidth', 1);
                        if (line.child.icon_item.type == "image") {
                            highlight_rect_hide(line.child.icon_item);
                        } else {
                            line.child.icon_item.set("strokeWidth", 1);
                        }

                    }
                }

                //Hide highlight for parent lines/icons 
                if (res_svg_item.parent_lines) {
                    for (var i in res_svg_item.parent_lines) {
                        var line = res_svg_item.parent_lines[i];
                        line.set('strokeWidth', 1);
                        if (line.child.icon_item.type == "image") {
                            highlight_rect_hide(line.parent.icon_item);
                        } else {
                            line.child.icon_item.set("strokeWidth", 1);
                        }

                    }
                }


                /* Highlight current research icon */
                if (res_svg_item.icon_item.type == "image") {

                    res_svg_item.icon_item.filters = [];
                    res_svg_item.icon_item.applyFilters(canvas.renderAll.bind(canvas));
                } else {
                    res_svg_item.icon_item.set("strokeWidth", 1);
                }

                canvas.renderAll();

            }
            canvas.on('object:over', function (options) {
                //console.log('object:over', options.target.type);
                if (hovered_items, length > 0)
                {
                    for (var ie in hovered_items)
                    {
                        hover_off(hovered_items[ie]);
                        hovered_items[ie].hovered = false;
                    }
                }
                if (options.target) {
                    if (options.target.res_svg_item) {
                        var res_svg_item = options.target.res_svg_item;
                        if (res_svg_item.hovered == undefined || res_svg_item.hovered == false) {
                            if (hover_event != null) {
                                clearTimeout(hover_event);
                            }
                            hover_event = setTimeout(function () {
                                hover_on(res_svg_item);
                                res_svg_item.hovered = true;
                                hover_event = null;
                                hovered_items.push(res_svg_item);
                            }, 400)
                        }
                    }
                }
            });

            canvas.on('object:out', function (options) {
                //console.log('object:out', options.target.type);
                if (options.target) {
                    if (options.target.res_svg_item) {
                        var res_svg_item = options.target.res_svg_item;
                        if (res_svg_item.hovered) { //may be not hovered if we clearedTimeout in above hover function
                            hover_off(res_svg_item);
                            res_svg_item.hovered = false;
                        }
                    }
                }
            });
        }

        canvas.renderAll(); // Note, calling renderAll() is important because we setted off automatical drawing of objects on add/insert
    }

    /* Wait for all images loaded - then run  draw_research_tree_part2*/
    {
        var check_images_load_state = function () {
            for (var res_id in res_svg_items_hash) {
                var svg_res_item = res_svg_items_hash[res_id];
                if (svg_res_item.icon_item == null) {
                    setTimeout(check_images_load_state, 500);
                    return;
                }
            }
            draw_research_tree_part2();
        }
        setTimeout(check_images_load_state, 100);
    }

    
}

function DrawResearchTimeLine()
{


}

function is_tank_body_upgrade(res) {
    if (Upgrades[player_all_researched].research_data != undefined)
        if (Upgrades[player_all_researched].research_data[res.grid_id] != undefined)
            if (Upgrades[player_all_researched].research_data[res.grid_id].body_res_class == "Droids") {
                var changed_field = Upgrades[player_all_researched].research_data[res.grid_id].body_res_changed_field;
                if (changed_field == "armourKinetic" || changed_field == "armourHeat" || changed_field == "hitpoints") {
                    return true;
                }
            }
    return false;
}

function is_cyborg_body_upgrade(res) {
    if (Upgrades[player_all_researched].research_data != undefined)
        if (Upgrades[player_all_researched].research_data[res.grid_id] != undefined)
            if (Upgrades[player_all_researched].research_data[res.grid_id].body_res_class == "Cyborgs") {
                var changed_field = Upgrades[player_all_researched].research_data[res.grid_id].body_res_changed_field;
                if (changed_field == "armourKinetic" || changed_field == "armourHeat" || changed_field == "hitpoints") {
                    return true;
                }
            }
    return false;
}

function GetResearchIcon_src(research_id) {
    var has_icon = GetIcon_CheckIconFilenameHashed(GetIcon_filename(research_id));
    if (has_icon) {
        return GetIcon_src(Researches.icon_folder, research_id);
    } else {
        /* Try find icon for Research */
        var comp_res = Researches.loaded_data_hash[research_id];
        if (comp_res.statID != undefined) {
            has_icon = GetIcon_CheckIconFilenameHashed(GetIcon_filename(comp_res.statID));
            if (has_icon) {
                StatID_DataObject = FindDataObject(comp_res.statID);
                if (StatID_DataObject != null) {
                    return GetIcon_src(StatID_DataObject.icon_folder, comp_res.statID);
                }
            }
        }
    }
    return null;
}

function connectionPath(bb1, bb2, child_conn_number)
{

    //var bb1 = obj1.getBBox(),
    //bb2 = obj2.getBBox(),
    p = [
        { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
        { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
        { x: bb1.x - 1,             y: bb1.y + bb1.height / 2 },
        { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
        { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
        { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
        { x: bb2.x - 1,             y: bb2.y + bb2.height / 2 },
        { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
    ],

    d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }

    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

    var y4_offset = child_conn_number * 7;
    y4 = y4 + y4_offset;
    var path = ["M", x1, y1, "C", x2, y2, x3, y3,
                         x4 - 2, y4,
                         //arrow: 
                    'L', x4 - 4, y4 + 3,
                    'L', x4 + 1, y4,
                    'L', x4 - 4, y4 - 3,
                    'L', x4 - 2, y4
                ].join(',');

    return path;
}

Raphael.fn.connection = function (obj1, obj2, line, bg) {
    //var color = line;
    //var path = [["M", obj1.attr("x"), obj1.attr("y")], ["L", obj2.attr("x"), obj2.attr("y")]];
    //return {
    //    line: this.path(path).attr({ stroke: color }),
    //    from: obj1,
    //    to: obj2
    //};

    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{ x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
        { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
        { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
        { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },
        { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
        { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
        { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
        { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({ path: path });
        line.line.attr({ path: path });
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({ stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3 }),
            line: this.path(path).attr({ stroke: color, fill: "none" }),
            from: obj1,
            to: obj2
        };
    }
};

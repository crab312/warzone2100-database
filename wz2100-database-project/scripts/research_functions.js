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
                }
            }
        }
        else if (['ResearchPoints', 'ProductionPoints', 'PowerPoints', 'RepairPoints', 'RearmPoints'].indexOf(s[0]) >= 0) {
            s[0] = setCharAt(s[0], 0, s[0][0].toLowerCase());  // <<<< SHIT
            var int_value = parseFloat(s[1]);
            for (var i in Upgrades[player].Building) {
                if (Stats.Building[i][s[0]] > 0) // only applies if building has this stat already
                {
                    Upgrades[player].Building[i][s[0]] += Stats.Building[i][s[0]] * int_value / 100;
                }
            }
        }
        else if (['Wall', 'Structure'].indexOf(s[0]) >= 0) {
            s[1] = setCharAt(s[1], 0, s[1][0].toLowerCase());  // <<<< SHIT
            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player].Building) {
                var hardcoded_type = "";
                if (Stats.Building[i].Type == "DEFENSE") {
                    hardcoded_type = "Wall";
                } else {
                    hardcoded_type = "Structure";
                }
                if(s[1].toLowerCase() == 'hitpoints')
                {
                    s[1] = 'hitpoints';
                }

                if (Stats.Building[i].Type === s[0]) // applies to specific building type
                {
                    Upgrades[player].Building[i][s[1]] += Stats.Building[i][s[1]] * int_value / 100;
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
            }
        }
        else if (Stats.WeaponClass.indexOf(s[0]) >= 0) // if first field is a weapon class
        {
            s[1] = setCharAt(s[1], 0, s[1][0].toLowerCase());  // <<<< SHIT
            var firePause = s[1] == 'firePause';
            if (s[1] == "repeatDamage") {
                s[1] = "periodicalDamage";
            }
            var int_value = parseFloat(s[2]);
            for (var i in Upgrades[player].Weapon) {
                if (Stats.Weapon[i][s[1]] > 0 && Stats.Weapon[i].weaponSubClass === s[0]) {
                    if (firePause) {
                        if (Upgrades[player].Weapon[i]['reloadTime'] == undefined || Upgrades[player].Weapon[i]['reloadTime'] == 0) {
                            Upgrades[player].Weapon[i]['firePause'] += Stats.Weapon[i]['firePause'] * int_value / 100;
                        } else {
                            Upgrades[player].Weapon[i]['reloadTime'] += Stats.Weapon[i]['reloadTime'] * int_value / 100;
                        }
                    } else {
                        Upgrades[player].Weapon[i][s[1]] += Stats.Weapon[i][s[1]] * int_value / 100;
                    }
                }
            }
        }
        else {
            debug("(error) Unrecognized research hint=" + s[0]);
        }
    }
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
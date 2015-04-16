
var machine = {
	"memory":0,
	"device":0,

	"algorithm":"FCFS",
	"quantum":1,
	"priority":true,
	"changing":false,
	"readyOptimize":true,

	"tableInfo":[],
	"processor":[],

	"notInserted":[],
	"hold":[],
	"ready":[],
	"endQue":[],

	"running":null,
	"lastChecked":0,
	"time":0
}

function Process(name) {
	this.name = name;
	this.arrivedTime = 0;
	this.brustTime = 0;
	this.priority = 0;
	this.runTime = 0;

	this.running = false;
	this.isEnded = false;

	this.list = function() {
		return {
			"value":[this.name, this.arrivedTime, this.brustTime, this.priority],
			"category":["name", "arrivedTime", "brustTime", "priority"]
		};
	}

	this.turnaround = function() {
		return 0;
	}

	this.fork = function() {

	}

	this.ready = function() {
		if(p.memory <= machine.memory && p.device <= machine.device) {
			machine.memory -= p.memory
			machine.device -= p.device

			machine.readyQue.push(p)
			machine.holdQue.splice(i, 1)

			return true
		}
		return false
	}

	this.awake = function() {
		if(!this.isRunning) {
			machine.running = this

			// or may be this can be replaced with shift ope
			machine.readyQue.splice(machine.readyQue.indexOf(this),1)
		}
	}

	this.end = function() {
		if(this.isRunning && this.brustTime <= this.runTime) {
			this.endTime = machine.time
			this.isRunning = false
			this.isEnded = true

			machine.running = null
			machine.endQue.push(this)
		}
	}

	this.sleep = function() {
		if(this.isRunning) {
			this.isRunning = false

			machine.running = null
			machine.readyQue.push(this)
		}	
	}

	return this;
}

var algorithms = ["FCFS", "SJF", "SRT", "NP", "RR"]
$("body").ready(init);

function init() {
	machine.readyOptimize = $("#MITTD_optiomize").is(":checked")
	machine.priority = $("#MITTD_priority").is(":checked")

	console.log(machine.readyOptimize, machine.priority)	
	$(".MITTD")
		.css("cursor", "pointer")
		.click(clickIT)

	$("#AddProcessorBtn")
		.click(function() {
			var name = "P"+(machine.processor.length+1)
			var p = new Process(name)

			machine.processor.push(p)
			// <td>#</td><td>arrived time</td><td>brust time</td><td>priority</td>

			var str = "<tr id=\"Process_"+name+"\" index=\""+machine.processor.length+"\">", list = p.list()
			for(var i in list["value"])
				str += "<td class=\"PTTD col-md-3\" target=\""+list["category"][i]+"\" class=\"col-md-3\">"+list["value"][i]+"</td>"
			str += "</tr>"

			$("#ProcessorTable tbody").append(str)
			$(".PTTD").click(clickIT)
			console.log(machine.processor)
		})
}

function clickIT(event) {
	var object = $(this)
	var text = object.text(), target = object.attr("target"), type = object.attr("class").split(' ')[0]
	console.log(type)
	if(!machine.changing) {
		if(type == "MITTD") {
			if(target == "algorithm") {
				var ind = (algorithms.indexOf(text)+1)%algorithms.length
				machine.algorithm = algorithms[ind]
				if(machine.algorithm == "RR") {
					$("#MachineInfoTable thead td:nth-child(5)").css("visibility", "visible")
					$("#MachineInfoTable thead td:nth-child(6)").css("visibility", "visible")
					$(".MITTD:nth-child(5)").css("visibility", "visible")
					$(".MITTD:nth-child(6)").css("visibility", "visible")
				} else {
					$("#MachineInfoTable thead td:nth-child(5)").css("visibility", "hidden")
					$("#MachineInfoTable thead td:nth-child(6)").css("visibility", "hidden")
					$(".MITTD:nth-child(5)").css("visibility", "hidden")
					$(".MITTD:nth-child(6)").css("visibility", "hidden")
				}
			} else if(target == "priority") {
				machine.priority = !machine.priority
				console.log(machine.priority)
			} else if(target == "optimize") {
				machine.readyOptimize = !machine.readyOptimize
				console.log(machine.readyOptimize)
			} else {
				machine.changing = true
	// <input type="number" min="0" inputmode="numeric" pattern="[0-9]*" title="Non-negative integral number">
				object
					.text("")
					.append("<input target=\""+target+"\" class=\"MachineChangeNumber col-md-12\" type=\"number\" inputmode=\"numeric\" pattern=\"[0-9]*\" min=\"0\" />")
				$(".MachineChangeNumber")
					.focus()
					.focusout(function(event) {
						ChangeMachineInfo(this)
					})
					.keydown(function(event) {
						if(event.which == 13)
							ChangeMachineInfo(this)
					})

			}
		} else if(type == "PTTD") {
			if(target != "name") {
				machine.changing = true
				console.log(object.parent().attr("index"))
				object
					.text("")
					.append("<input target=\""+target+"\" index=\""+object.parent().attr("index")+"\" class=\"MachineChangeNumber col-md-12\" type=\"number\" inputmode=\"numeric\" pattern=\"[0-9]*\" min=\"0\" width=\"100%\"/>")
				$(".MachineChangeNumber")
					.focus()
					.focusout(function(event) {
						ChangeMachineInfo(this)
					})
					.keydown(function(event) {
						if(event.which == 13)
							ChangeMachineInfo(this)
					})

			}
		}
	}
	refresh()
}

function ChangeMachineInfo(event) {
	console.log(event)
	var object = $(event), num = parseInt(object.val()) || 0, type = object.parent().attr("class").split(' ')[0], target=object.attr("target")
	console.log("type", type)
	// console.log(object.val(), num, object.attr("target"))
	if(type == "MITTD") {
		machine[target] = num
	} else if(type == "PTTD") {
		var ind = parseInt(object.attr("index"))
		console.log("index",object.attr("index"))
		if(!isNaN(ind)) {
			console.log(machine.processor[ind-1], target, num)	
			machine.processor[ind-1][target] = num
		}
	}

	machine.changing = false

	refresh()
}

function refresh() {
	if(!machine.changing) {
		$(".MITTD:nth-child(2)").text(machine.memory)
		$(".MITTD:nth-child(3)").text(machine.device)
		$(".MITTD:nth-child(4)").text(machine.algorithm)
		$(".MITTD:nth-child(5)").text(machine.quantum)

		for(var i in machine.processor) {
			var p = machine.processor[i]
			var $tr = $("#Process_"+p.name)
			console.log(i, p, $tr, "#Process_"+p.name)
			$tr.children(":nth-child(1)").text(p.name)
			$tr.children(":nth-child(2)").text(p.arrivedTime)
			$tr.children(":nth-child(3)").text(p.brustTime)
			$tr.children(":nth-child(4)").text(p.priority)	
		}
	}
}

/////////////////////////////////// ui source code end ///////////////////////////////////

////////////////////////////////// main algorithm start //////////////////////////////////

function run() {
	machine.time = 0
	for(machine.time;machine.time<100;machine.time++) {

	}
}



function SortHoldQue() {
	if(machine.algorithms == "SRT") {
		SortHoldQue_SRT(MACHINE.holdQue)
	} else if(machine.algorithms == "SJF") {
		SortHoldQue_SJF(MACHINE.holdQue)
	} else if(machine.algorithms == "RR") {
		if(machine.priority) {
			SortHoldQue_P(MACHINE.holdQue)
		}
	}
}

// order by priority
function SortHoldQue_P(queue) {

}

// order by remaining time
function SortHoldQue_SRT(queue) {
	var list = []
	//blah blah blah


	if(machine.priority)
		for(var i in list) {
			list[i] = SortHoldQue_P(list[i])
		}
}

// order by burst time
function SortHoldQue_SJF(queue) {
	var list = []
	//blah blah blah

	if(machine.priority)
		for(var i in list) {
			list[i] = SortHoldQue_P(list[i])
		}
}

function Fork() {
	for(var i in machine.notInserted) {
		var p = machine.notInserted[i]
		if(p.arrivedTime <= machine.time) {
			machine.hold.push(p)
			machine.notInserted.splice(i, 1)
		}
	}
	SortHoldQue()
}

// holdQue to readyQue
function Ready() {
	for(var i in machine.holdQue) {
		var ok = machine.holdQue[i].ready()

		if(ok && machine.readyOptimize) {
			break
		}
	}
}

// readyQue to running
function Awake() {
	var p = machine.running
	if(p) {
		if(p.brustTime <= p.runTime) {
			p.end()
		} else if(machine.lastChecked + machine.quantum <= machine.time) {
			p.sleep()
		}
	}

	p = machine.readyQue[0]
	p.awake()
}
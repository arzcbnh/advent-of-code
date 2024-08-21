local input = ...

local frequency = 0
local repetitions = { [frequency] = 1 }
local first_repetition, calibration

while not first_repetition do
	input:seek("set")

	for line in input:lines() do
		frequency = frequency + tonumber(line)
		repetitions[frequency] = repetitions[frequency] or 0
		repetitions[frequency] = repetitions[frequency] + 1
	
		if repetitions[frequency] == 2 then
			first_repetition = first_repetition or frequency
		end
	end

	calibration = calibration or frequency
end

return calibration, first_repetition

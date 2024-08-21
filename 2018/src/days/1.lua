local utils = require "utils"

local function main(input)
	local frequency = 0
	local repetitions = { [0] = 1 }
	local firstSum, firstRepeatedFrequency

	while not firstRepeatedFrequency do
		for line in utils.iterateLines(input) do
			frequency = frequency + tonumber(line)
			repetitions[frequency] = (repetitions[frequency] or 0) + 1
		
			if repetitions[frequency] == 2 then
				firstRepeatedFrequency = firstRepeatedFrequency or frequency
				-- The loop can't be broken because there's a chance a frequency
				-- repeats before all changes are summed first
			end
		end

		firstSum = firstSum or frequency
	end

	return firstSum, firstRepeatedFrequency
end

return main

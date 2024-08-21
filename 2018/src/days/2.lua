local utils = require "utils"

local function countLetters(id)
    local arr = {}

    for i = 1, #id do
        local letter = string.sub(id, i, i)
        arr[letter] = (arr[letter] or 0) + 1
    end

    return arr
end

local function filterByRepeatedLetterAmount(arr, wantedAmount)
    return utils.filter(arr, function(count)
        for _, countedAmount in pairs(count) do
            if countedAmount == wantedAmount then return true end
        end
        
        return false
    end)
end

local function idsDifferBySingleLetter(a, b)
    local differences = 0

    for i = 1, #a do
        local aLetter = string.sub(a, i, i)
        local bLetter = string.sub(b, i, i)

        if aLetter ~= bLetter then
            differences = differences + 1
        end
    end
    
    return differences == 1
end

local function findCorrectBoxIds(ids)
    for i = 1, #ids do
        for j = i + 1, #ids do
            if idsDifferBySingleLetter(ids[i], ids[j]) then
                return ids[i], ids[j]
            end
        end
    end
end

local function removeDifferentLetter(a, b)
    for i = 1, #a do
        local aLetter = string.sub(a, i, i)
        local bLetter = string.sub(b, i, i)

        if aLetter ~= bLetter then
            return string.gsub(a, aLetter, "", 1)
        end
    end
end

return function(input)
    local ids = utils.split(input, "\n")
    local count = utils.map(ids, function(id) return countLetters(id) end)
    local twoRepeatedLetters = filterByRepeatedLetterAmount(count, 2)
    local threeRepeatedLetters = filterByRepeatedLetterAmount(count, 3)
    local hash = #twoRepeatedLetters * #threeRepeatedLetters

    local correctBoxIds = { findCorrectBoxIds(ids) }
    local commonLetters = removeDifferentLetter(table.unpack(correctBoxIds))

    return hash, commonLetters
end


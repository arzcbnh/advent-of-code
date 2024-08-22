local utils = require "utils"

local FABRIC_DIMENSION = 999

local function updateFabric(fabric, pos)
    fabric[pos] = (fabric[pos] or 0) + 1
end

local function calcPosition(i, j, claim)
    claim = claim or {x = 0, y = 0}
    return i + claim.x + (claim.y + j - 1) * FABRIC_DIMENSION
end

local function iterClaimInches(claim)
    local w = 0
    local h = 1

    return function()
        w = w + 1

        if w > claim.width then
            w = 1
            h = h + 1
        end

        if h > claim.height then return nil end
        
        return calcPosition(w, h, claim)
    end
end

local function generateFabric(claims)
    local fabric = {}
    
    for _, claim in ipairs(claims) do
        for i in iterClaimInches(claim) do
            updateFabric(fabric, i)
        end
    end

    return fabric
end

local function countOverlaps(fabric)
    local count = 0

    for i = 1, FABRIC_DIMENSION ^ 2 do
        if fabric[i] and fabric[i] > 1 then
            count = count + 1
        end
    end

    return count
end

local function findIsolatedClaim(claims, fabric)
    for _, claim in ipairs(claims) do
        local isIsolated = true

        for i in iterClaimInches(claim) do
            isIsolated = fabric[i] == 1
            if not isIsolated then break end
        end

        if isIsolated then return claim end
    end
end

local function parseClaim(claim)
    local pattern = "#(%d+) @ (%d+),(%d+): (%d+)x(%d+)"
    local id, x, y, width, height = string.match(claim, pattern)
    
    return {
        id = tonumber(id),
        x = tonumber(x),
        y = tonumber(y),
        width = tonumber(width),
        height = tonumber(height),
    }
end

return function(input)
    local inputLines = utils.split(input, "\n")
    local claims = utils.map(inputLines, parseClaim)
    local fabric = generateFabric(claims)
    local overlaps = countOverlaps(fabric)
    local isolatedClaim = findIsolatedClaim(claims, fabric)

    return overlaps, isolatedClaim.id
end

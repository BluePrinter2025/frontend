import api from './request';

export const getAllProject = () => {
    return api.get('/allProject');
};

export const createNewProject = (step, name) => {
    return api.post(`/createNewProject`,
        {
            "name": name,
            "step": step,
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}

export const generateObject = (winterSolstice, spreadRatio, remoteDistance, buildingInterval, standardArea, maxHeight, maxFloor, firstFloor, standardFloor, objFile, mtlFile, projectId) => {
    return api.post(`/generateObj`,
        {
            "winterSolstice": winterSolstice,
            "spreadRatio": spreadRatio,
            "remoteDistance": remoteDistance,
            "buildingInterval": buildingInterval,
            "standardArea": standardArea,
            "maxHeight": maxHeight,
            "maxFloor": maxFloor,
            "firstFloor": firstFloor,
            "standardFloor": standardFloor,
            "objFile": objFile,
            "mtlFile": mtlFile,
            "projectId": projectId,
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    );
}
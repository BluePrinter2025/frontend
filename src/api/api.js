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

export const generateObject = (winterSolstice, spreadRatio, remoteDistance, buildingInterval, standardArea, maxHeight, maxFloor, firstFloor, standardFloor, objFile, mtlFile, projectId, measuringScale) => {
    const formData = new FormData();
    formData.append('winterSolstice', winterSolstice);
    formData.append('spreadRatio', spreadRatio);
    formData.append('remoteDistance', remoteDistance);
    formData.append('buildingInterval', buildingInterval);
    formData.append('standardArea', standardArea);
    formData.append('maxHeight', maxHeight);
    formData.append('maxFloor', maxFloor);
    formData.append('firstFloor', firstFloor);
    formData.append('standardFloor', standardFloor);

    formData.append('objFile', objFile);
    formData.append('mtlFile', mtlFile);
    formData.append('projectId', projectId);
    formData.append('measuringScale', measuringScale);

    return api.post(`/generateObj`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getPreview = (objFile, mtlFile) => {
    const formData = new FormData();
    formData.append('objFile', objFile);
    formData.append('mtlFile', mtlFile);
    return api.post(`/getPreview`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
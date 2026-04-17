// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import pick from "../../../helpers/pick.js";
import documentTemplateService, { translateToHindi } from "./documentTemplate.service.js";

const createDocumentTemplate = catchAsync(async (req, res) => {
  const data = req.body;

  const response = await documentTemplateService.createDocumentTemplate(data);


  const newRes = await Promise.all(response.body.map(async (body) => {
    if (body.language == "hindi") {

      const hindiData = await translateToHindi(body.body);
      return { ...body, body: hindiData };
    } else {
      return body;
    }
  }));

  console.log(newRes);


  res.status(httpStatus.CREATED).json({
    success: true,
    message: "documentTemplate created successfully",
    data: newRes,
  });
});

const getDocumentTemplateById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await documentTemplateService.getDocumentTemplateById(id);

  if (!response) {
    throw new Error("Not Found");
  }

  const body = await Promise.all(response.body.map(async (body) => {
    if (body.language == "hindi") {

      const hindiData = await translateToHindi(body.body);
      return { ...body, body: hindiData }
    } else {
      return body;
    }
  }));


  res.status(httpStatus.OK).json({
    success: true,
    message: "documentTemplate fetched successfully",
    data: { data: { ...response, body } },
  });
});

const getPaginatedDocumentTemplates = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["search", "businessUnitId", "type"]);
  const options = pick(req.query, ["sort_by", "sort_order", "limit", "page"]);
  const response = await documentTemplateService.getPaginatedDocumentTemplates(
    filters,
    options,
  );

  const newRes = await Promise.all(response.data.map(async (data) => {
    const body = await Promise.all(data.body.map(async (body) => {
      if (body.language == "hindi") {

        const hindiData = await translateToHindi(body.body);
        return { ...body, body: hindiData };
      } else {
        return body;
      }
    }));


    return { ...data, body };
  }));

  res.status(httpStatus.OK).json({
    success: true,
    message: "documentTemplates fetched successfully",
    data: newRes,
  });
});

const updateDocumentTemplate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const response = await documentTemplateService.updateDocumentTemplate(
    id,
    data,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "documentTemplate updated successfully",
    data: response,
  });
});

const deleteDocumentTemplate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const response = await documentTemplateService.deleteDocumentTemplate(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "documentTemplate deleted successfully",
    data: response,
  });
});

const documentTemplateController = {
  createDocumentTemplate,
  getDocumentTemplateById,
  getPaginatedDocumentTemplates,
  updateDocumentTemplate,
  deleteDocumentTemplate,
};
export default documentTemplateController;

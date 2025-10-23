"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBehaviorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_behavior_dto_1 = require("./create-behavior.dto");
class UpdateBehaviorDto extends (0, mapped_types_1.PartialType)(create_behavior_dto_1.CreateBehaviorDto) {
}
exports.UpdateBehaviorDto = UpdateBehaviorDto;
//# sourceMappingURL=update-behavior.dto.js.map
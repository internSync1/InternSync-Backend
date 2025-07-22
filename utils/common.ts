import { ApplicationStatus } from "../constant/applicationStatus";

export function validateApplicationStatus(status: ApplicationStatus, newStatus: ApplicationStatus): boolean {
    switch (status) {
        case ApplicationStatus.PENDING:
            return newStatus === ApplicationStatus.APPROVED || newStatus === ApplicationStatus.REJECTED;
        case ApplicationStatus.APPROVED:
            return newStatus === ApplicationStatus.REJECTED;
        case ApplicationStatus.REJECTED:
            return false;
        default:
            return false;
    }
}
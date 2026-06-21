"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Loader2 } from "lucide-react";
import {
  useMatchingRequests,
  useMyAcceptedTrialRequests,
  useAcceptTrialRequest,
  useAcceptSessionRequest,
  type UnifiedRequest,
} from "@/hooks/api/use-trial-requests";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api-client";

// Helper function to calculate days ago
const getDaysAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper to get student name from request
const getStudentName = (request: UnifiedRequest, t: any) => {
  if (request.studentId?.name) return request.studentId.name;
  if (request.studentInfo?.name) return request.studentInfo.name;
  return t("unknownStudent");
};

export default function RequestsPage() {
  const t = useTranslations("requests");
  const te = useTranslations("error");
  const [activeTab, setActiveTab] = useState<"open" | "accepted">("open");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<UnifiedRequest | null>(null);
  const [introMessage, setIntroMessage] = useState("");
  const [isInfoOnly, setIsInfoOnly] = useState(false);
  const itemsPerPage = 6;

  // Fetch open requests (matching tutor's subjects)
  const { data: openRequestsData, isLoading: isLoadingOpen } = useMatchingRequests({
    page: activeTab === "open" ? currentPage : 1,
    limit: itemsPerPage,
  });

  // Fetch accepted requests
  const { data: acceptedRequestsData, isLoading: isLoadingAccepted } = useMyAcceptedTrialRequests({
    page: activeTab === "accepted" ? currentPage : 1,
    limit: itemsPerPage,
  });

  // Accept mutations
  const { mutate: acceptTrialRequest, isPending: isAcceptingTrial } = useAcceptTrialRequest();
  const { mutate: acceptSessionRequest, isPending: isAcceptingSession } = useAcceptSessionRequest();

  const isAccepting = isAcceptingTrial || isAcceptingSession;

  const openRequests = openRequestsData?.data || [];
  const acceptedRequests = acceptedRequestsData?.data || [];
  const totalPages = activeTab === "open"
    ? (openRequestsData?.meta?.totalPage || 1)
    : (acceptedRequestsData?.meta?.totalPage || 1);

  const handleTabChange = (tab: "open" | "accepted") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleViewClick = (request: UnifiedRequest, infoOnly: boolean = false) => {
    setSelectedRequest(request);
    setIsInfoOnly(infoOnly);
    setIsModalOpen(true);
    setIntroMessage("");
  };

  const handleSendAccept = () => {
    if (!selectedRequest || !introMessage.trim()) {
      toast.error(t("introError"));
      return;
    }

    const acceptFn = selectedRequest.requestType === 'TRIAL' ? acceptTrialRequest : acceptSessionRequest;

    acceptFn(
      { id: selectedRequest._id, introductoryMessage: introMessage },
      {
        onSuccess: () => {
          toast.success(t("acceptSuccess"));
          setIsModalOpen(false);
          setIntroMessage("");
          setSelectedRequest(null);
          setActiveTab("accepted");
          setCurrentPage(1);
        },
        onError: (error: any) => {
          toast.error(
            error instanceof ApiError
              ? error.getLocalizedMessage(te)
              : error?.response?.data?.message || t("acceptFailed"),
          );
        },
      }
    );
  };

  const tCommon = useTranslations("common");

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className=" rounded-lg">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("open")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "open"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t("openRequests")}
          </button>
          <button
            onClick={() => handleTabChange("accepted")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === "accepted"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t("acceptedRequests")}
          </button>
        </div>

        {/* Content */}
        {activeTab === "open" ? (
          isLoadingOpen ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#002AC8]" />
            </div>
          ) : openRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t("noOpenRequests")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openRequests.map((request) => {
                const daysAgo = getDaysAgo(request.createdAt);
                return (
                  <div key={request._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.subject?.name || t("unknownSubject")}</h3>
                      </div>
                      <span
                        className={`text-sm font-medium ${daysAgo <= 2 ? "text-orange-500" : "text-green-600"}`}
                      >
                        {t("daysAgo", { n: daysAgo })}
                      </span>
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600">{request.schoolType}</p>
                      <p className="text-sm text-gray-600">{t("grade", { level: request.gradeLevel })}</p>
                    </div>
                    <button
                      onClick={() => handleViewClick(request, false)}
                      className="w-full bg-[#002AC8] text-white font-medium py-3 rounded-lg hover:bg-[#0024a8] transition-colors"
                    >
                      {t("view")}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          isLoadingAccepted ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#002AC8]" />
            </div>
          ) : acceptedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t("noAcceptedRequests")}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Mobile horizontal scroll wrapper */}
              <div className="w-full overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="bg-[#FAFAFA] border border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("name")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("subject")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("status")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("action")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {acceptedRequests.map((request: UnifiedRequest) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getStudentName(request, t)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.subject?.name || t("unknownSubject")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewClick(request, true)}
                            className="bg-[#002AC8] text-white px-6 py-2 rounded-md hover:bg-[#0024a8] transition-colors font-medium"
                          >
                            {t("view")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-base font-semibold text-gray-900 border-b pb-4">
              {t("studentInformation")}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="px-6 pb-6">
          <div className="space-y-4">
            {/* Student Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("name")}</p>
                <p className="text-sm text-gray-900">{selectedRequest ? getStudentName(selectedRequest, t) : t("unknownStudent")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("subject")}</p>
                <p className="text-sm text-gray-900">{selectedRequest?.subject?.name || t("unknownSubject")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("schoolType")}</p>
                <p className="text-sm text-gray-900">{selectedRequest?.schoolType || t("unknown")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t("grade2")}</p>
                <p className="text-sm text-gray-900">{selectedRequest?.gradeLevel ? t("grade", { level: selectedRequest.gradeLevel }) : t("unknown")}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">{t("description")}</p>
              <p className="text-sm text-gray-700">
                {selectedRequest?.description || t("noDescription")}
              </p>
            </div>

            {/* Learning Goals */}
            {selectedRequest?.learningGoals && (
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">{t("learningGoals")}</p>
                <p className="text-sm text-gray-700">{selectedRequest.learningGoals}</p>
              </div>
            )}

            {/* Documents */}
            {selectedRequest?.documents && selectedRequest.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">{t("documents")}</p>
                {selectedRequest.documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#002AC8]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t("document", { n: index + 1 })}</p>
                      </div>
                    </div>
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="text-[#002AC8] hover:text-[#0024a8]">
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {!isInfoOnly && (
              <>
                {/* Introduction Message */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    {t("introMessage")}
                  </label>
                  <textarea
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    placeholder={t("introPlaceholder")}
                    className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002AC8] focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    disabled={isAccepting}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {tCommon("cancel")}
                  </button>
                  <button
                    onClick={handleSendAccept}
                    disabled={isAccepting}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#002AC8] rounded-lg hover:bg-[#0024a8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("accepting")}
                      </>
                    ) : (
                      t("sendAccept")
                    )}
                  </button>
                </div>
              </>
            )}

            {isInfoOnly && (
              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {tCommon("close")}
                </button>
              </div>
            )}
          </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
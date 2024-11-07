import CreateKBForm from "@/components/create-kb-form";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKnowledgeBaseStore } from "@/store/kb-store";
import { useModalStore } from "@/store/modal-store";
import { DeleteIcon, PlusIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

const KnowledgeBasesPage = () => {
  const { onOpen, setCustomFormComponent, setTitle, setSubtitle } =
    useModalStore();
  const { knowledgeBaseList, totalPages, setCurrentPage } =
    useKnowledgeBaseStore();
  const openKBCreateForm = () => {
    setCustomFormComponent(CreateKBForm);
    setTitle("Create Knowledge Base");
    setSubtitle("Create a new knowledge base to store your files and URLs");
    onOpen();
  };
  return (
    <section className="gap-3 p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Knowledge Bases</h1>
        <Button onClick={() => openKBCreateForm()} variant={"outline"}>
          <PlusIcon />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>URLs</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {knowledgeBaseList.map((kb, index) => (
            <TableRow key={kb.id}>
              <TableHead>{index + 1}</TableHead>
              <TableCell>{kb.name}</TableCell>
              <TableCell>{kb.files}</TableCell>
              <TableCell>{kb.urls}</TableCell>
              <TableCell>
                <Button variant="outline">
                  <DeleteIcon className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => setCurrentPage(1)} href="#">
              1
            </PaginationLink>
          </PaginationItem>

          {totalPages > 1 && (
            <Fragment>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setCurrentPage(totalPages)}
                  href="#"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          )}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export default KnowledgeBasesPage;

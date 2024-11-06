import CreateKBForm from "@/components/create-kb-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModalStore } from "@/store/modal-store";
import { DeleteIcon, PlusIcon } from "lucide-react";

const KnowledgeBasesPage = () => {
  const { onOpen, setCustomFormComponent, setTitle, setSubtitle } =
    useModalStore();
  const openKBCreateForm = () => {
    setCustomFormComponent(CreateKBForm);
    setTitle("Create Knowledge Base");
    setSubtitle("Create a new knowledge base to store your files and URLs");
    onOpen();
  };
  return (
    <section className="gap-3">
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
          <TableRow>
            <TableHead>1</TableHead>
            <TableCell>My KB</TableCell>
            <TableCell>[]</TableCell>
            <TableCell>[]</TableCell>
            <TableCell>
              <Button variant="outline">
                <DeleteIcon className="text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default KnowledgeBasesPage;

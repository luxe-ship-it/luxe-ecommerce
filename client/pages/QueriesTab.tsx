import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

export function QueriesTab() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: queries, isLoading } = useQuery({
        queryKey: ["contact-queries"],
        queryFn: async () => apiRequest("GET", "/contact")
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) =>
            apiRequest("PATCH", `/contact/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
            toast({ title: "Status updated" });
        }
    });

    const deleteQueryMutation = useMutation({
        mutationFn: async (id: string) => apiRequest("DELETE", `/contact/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-queries"] });
            toast({ title: "Query deleted" });
        }
    });

    if (isLoading) return <div>Loading queries...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Customer Queries</h2>
                <div className="text-sm text-muted-foreground">
                    Total: {queries?.length || 0}
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Subject</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {queries?.map((query: any) => (
                                <tr key={query.id} className="hover:bg-muted/50">
                                    <td className="p-4 font-medium">{query.name}</td>
                                    <td className="p-4">{query.email}</td>
                                    <td className="p-4">
                                        <div className="max-w-xs truncate" title={query.subject}>
                                            {query.subject}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={query.status}
                                            onChange={(e) => updateStatusMutation.mutate({ id: query.id, status: e.target.value })}
                                            className="px-2 py-1 border rounded text-xs"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="REPLIED">Replied</option>
                                            <option value="RESOLVED">Resolved</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(query.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const message = `Name: ${query.name}\nEmail: ${query.email}\nPhone: ${query.phone || 'N/A'}\nSubject: ${query.subject}\n\nMessage:\n${query.message}`;
                                                alert(message);
                                            }}
                                            className="text-primary hover:bg-primary/10 mr-2"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteQueryMutation.mutate(query.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {queries?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                        No queries yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

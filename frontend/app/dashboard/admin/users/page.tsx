"use client";

import { useEffect, useState } from "react";
import { Trash2, UserCog } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TR, TH, TD, EmptyRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { mock } from "@/lib/mock";
import type { Role, User } from "@/lib/types";
import { useRequireAuth } from "@/hooks/useAuth";

const ROLES: Role[] = ["voter", "admin", "commissioner", "counter", "anonymizer"];

const ROLE_VARIANT: Record<Role, "primary" | "violet" | "cyan" | "success" | "warning"> = {
  voter: "primary",
  admin: "violet",
  commissioner: "cyan",
  counter: "success",
  anonymizer: "warning",
};

export default function AdminUsersPage() {
  useRequireAuth(["admin"]);
  const [users, setUsers] = useState<User[]>([]);
  const { notify } = useToast();

  function reload() { mock.listUsers().then(setUsers); }
  useEffect(() => { reload(); }, []);

  async function changeRole(id: number, role: Role) {
    await mock.setUserRole(id, role);
    notify({ kind: "success", title: "Role updated" });
    reload();
  }

  async function remove(id: number) {
    if (!window.confirm("Remove this user?")) return;
    await mock.deleteUser(id);
    notify({ kind: "success", title: "User removed" });
    reload();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="User |management"
        description="Promote, demote, or remove users. Roles determine which workspace sections are accessible."
      />

      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Role</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <tbody>
              {users.length === 0 ? (
                <EmptyRow colSpan={4} label="No users." />
              ) : (
                users.map((u) => (
                  <TR key={u.id}>
                    <TD className="font-medium text-white">{u.full_name}</TD>
                    <TD className="font-mono text-xs">{u.email}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Badge variant={ROLE_VARIANT[u.role]} className="capitalize">{u.role}</Badge>
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value as Role)}
                          aria-label="Change role"
                          className="rounded-md border border-white/10 bg-ink-800/80 px-2 py-1 text-xs text-slate-300 focus:border-primary-400/60 focus:outline-none"
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </TD>
                    <TD className="text-right">
                      <div className="inline-flex gap-1">
                        <Button variant="ghost" size="sm" aria-label="Edit"><UserCog className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(u.id)} aria-label="Remove">
                          <Trash2 className="h-3.5 w-3.5 text-neon-red" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

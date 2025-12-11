import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

@Module({
  imports: [],
  exports: [SupabaseService],
  providers: [SupabaseService],
})
export class SupabaseModule {}
